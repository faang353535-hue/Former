import jwt from "jsonwebtoken";
import prisma from "../../lib/prisma.js";

export const startGithubAuth = (req, res) => {
    const redirectURI = process.env.GITHUB_REDIRECT_URI;
    const clientID = process.env.GITHUB_CLIENT_ID;

    const url = "https://github.com/login/oauth/authorize?" +
        new URLSearchParams({
            client_id: clientID,
            scope: "read:user user:email",
            redirect_uri: redirectURI,
        }).toString();

    // https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email`

    res.redirect(url);
};

export const githubLoginCallback = async (req, res) => {
    console.log("Git Login Callback has been called!");
    try {
        const code = req.query.code;

        const redirectURI = process.env.GITHUB_REDIRECT_URI;
        const clientID = process.env.GITHUB_CLIENT_ID;
        const clientSecret = process.env.GITHUB_CLIENT_SECRET;

        const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json"
            },
            body: new URLSearchParams({
                code: code,
                client_id: clientID,
                client_secret: clientSecret,
                redirect_uri: redirectURI,
            }),
        });

        const data = await tokenRes.json();

        const access_token = data.access_token;

        const userRes = await fetch("https://api.github.com/user", {
            headers: {
                "Authorization": `Bearer ${access_token}`,
                "Accept": "application/json"
            }
        });

        const userData = await userRes.json();

        const emailRes = await fetch("https://api.github.com/user/emails", {
            headers: {
                "Authorization": `Bearer ${access_token}`,
                "Accept": "application/json"
            }
        });

        const email = await emailRes.json();

        const primaryEmail = email.find(e => e.primary)?.email || null;

        const githubUser = {
            githubId: userData.id.toString(),
            name: userData.name,
            username: userData.login,
            email: primaryEmail,
            picture: userData.avatar_url,
        };

        if (!userData.name) {
            githubUser.name = githubUser.username;
        }

        let user = await prisma.User.findUnique({
            where: { email: githubUser.email },
        });

        if (!user) {
            user = await prisma.User.create({
                data: {                                      
                    githubId: githubUser.githubId,
                    firstName: githubUser.name,
                    email: githubUser.email,
                    picture: githubUser.picture,
                },
            });
        }
        console.log(user)
        const backendToken = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        const MAX_AGE = 7 * 24 * 60 * 60 * 1000;

        const cookieOptions = {
            httpOnly: true,
            maxAge: MAX_AGE,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/',
        };

        res.cookie('jwt', backendToken, cookieOptions);
        const redirectURL = `${process.env.FRONTEND_ORIGIN}`;
        return res.redirect(redirectURL);

    } catch (err) {
        console.error("Github Auth Error:", err);
        return res.redirect(`${process.env.FRONTEND_ORIGIN}/auth/error`);
    }
};
