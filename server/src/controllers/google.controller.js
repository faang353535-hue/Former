import jwt from "jsonwebtoken";
import prisma from "../../lib/prisma.js";

export const startGoogleAuth = (req, res) => {
    const redirectURI = process.env.GOOGLE_REDIRECT_URI;
    const clientID = process.env.GOOGLE_CLIENT_ID;

    const url =
        "https://accounts.google.com/o/oauth2/v2/auth?" +
        new URLSearchParams({
            client_id: clientID,
            redirect_uri: redirectURI,
            response_type: "code",
            scope: "openid email profile",
            access_type: "offline",
            prompt: "consent",
        }).toString();

    res.redirect(url);
};

export const googleLoginCallback = async (req, res) => {
    console.log("googleLoginCallback has been called!"); // Add this line
    // console.log(req)
    try {
        const code = req.query.code;
        console.log(code, '|*|*|*|*|*|*|')
        const redirectURI = process.env.GOOGLE_REDIRECT_URI;
        const clientID = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

        // STEP 1: Exchange "code" for access_token + id_token
        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                code,
                client_id: clientID,
                client_secret: clientSecret,
                redirect_uri: redirectURI,
                grant_type: "authorization_code",
            }),
        });
        const tokenData = await tokenRes.json();
        const id_token = tokenData.id_token;

        if (!id_token) {
            return res.redirect(`${process.env.FRONTEND_ORIGIN}/auth/error`);
        }

        const googleUser = jwt.decode(id_token);
        console.log(googleUser);
        
        const email = googleUser.email;
        const fullName = googleUser.name || "";
        const [firstName, ...restParts] = fullName.split(" ");
        const lastName = restParts.join(" ") || "Google";

        let user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    firstName,
                    lastName,
                    password: "GOOGLE_AUTH", // Not used but required by your schema
                },
            });
        }

        const backendToken = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        const MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

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
        console.error("Google Auth Error:", err);
        return res.redirect(`${process.env.FRONTEND_ORIGIN}/auth/error`);
    }
};
  