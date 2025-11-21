import prisma from '../../lib/prisma.js';
import bcrypt from 'bcrypt';
import { response } from 'express';
import jwt from 'jsonwebtoken';
import { userInfo } from 'os';

const MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

const createToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET not defined');
    }
    const expiresInSeconds = Math.floor(MAX_AGE / 1000);
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: `${expiresInSeconds}s`
    });
};

export const register = async (req, res) => {
    console.log('Register endpoint called with body:', req.body);
    try {
        const { firstName, lastName, email, password } = req.body;

        console.log('Checking for existing user with email:', email);
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        console.log('Creating new user...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword
            }
        });

        console.log('User created successfully:', user.id);
        const token = createToken(user.id);

        const cookieOptions = {
            httpOnly: true,
            maxAge: MAX_AGE,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/',
        };

        res.cookie('jwt', token, cookieOptions);

        const { password: _, ...userData } = user;
        res.status(201).json({ success: true, data: userData });
    } catch (error) {
        console.error('Registration error:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({
                error: 'Email already exists',
                details: 'Please use a different email address'
            });
        }
        return res.status(500).json({
            error: 'Registration failed',
            details: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = createToken(user.id);

        const cookieOptions = {
            httpOnly: true,
            maxAge: MAX_AGE,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/',
        };

        console.log('Setting auth cookie, options:', cookieOptions);
        res.cookie('jwt', token, cookieOptions);

        const { password: _, ...userData } = user;
        res.status(200).json({ success: true, data: userData });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Error during login' });
    }
};

export const logout = (req, res) => {
    // Clear cookie using same options (path/sameSite) so browser removes it reliably
    res.cookie('jwt', '', {
        httpOnly: true,
        maxAge: 1,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
    });
    res.json({ success: true, message: 'Logged out successfully' });
};

export const getProfile = async (req, res) => {
    try {
        // console.log('getProfile: req.user=', !!req.user, req.user );
        const { password: _, ...userData } = req.user;
        res.status(200).json({ success: true, data: userData });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching profile' });
    }
};      

export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

export const createForm = async (req, res) => {
    try {
        const { name, backgroundColor, fontColor, fields } = req.body;
        const { id: userId } = req.user; // Get the user ID from the authenticated user

        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const formData = {
            name,
            backgroundColor,
            fontColor,
            fields,
        };

        const newForm = await prisma.forms.create({
            data: {
                userId: userId,
                form_data: formData,
            },
        });

        res.status(201).json({ message: "Form created successfully", data: newForm });
    } catch (error) {
        console.error("Error creating form:", error);
        res.status(500).json({ error: "Failed to create form", details: error.message });
    }
};

export const getForms = async (req, res) => {
    try {
        const { id: userId } = req.user
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const result = await prisma.forms.findMany({
            where: { userId: userId },
            // select: { form_data: true, }
        })

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error("Error fetching forms:", error);
        res.status(500).json({ error: "Failed to fetch forms", details: error.message });
    }
};

export const updateForm = async (req, res) => {
    try {
        const { id: userId } = req.user;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const formId = parseInt(req.params.id, 10);
        if (isNaN(formId)) {
            return res.status(400).json({ error: 'Invalid form ID' });
        }
        // console.log(req.body.form_data);

        const { name, fields, fontColor, backgroundColor } = req.body.form_data;
        // console.log(name, backgroundColor, fontColor, fields);

        const existingForm = await prisma.forms.findUnique({
            where: { id: formId },
        });

        if (!existingForm) {
            return res.status(404).json({ error: 'Form not found' });
        }

        if (existingForm.userId !== userId) {
            return res.status(403).json({ error: 'You are not authorized to update this form' });
        }

        const updatedFormData = {
            name: name || existingForm.form_data.name,
            backgroundColor: backgroundColor || existingForm.form_data.backgroundColor,
            fontColor: fontColor || existingForm.form_data.fontColor,
            fields: fields || existingForm.form_data.fields,
        };

        const updatedForm = await prisma.forms.update({
            where: { id: formId },
            data: {
                form_data: updatedFormData,
            },
        });
        console.log(updateForm)
        res.status(200).json({ success: true, data: updatedForm });
    } catch (error) {
        console.error("Error updating form:", error);
        res.status(500).json({ error: "Failed to update form", details: error.message });
    }
};

export const deleteForms = async (req, res) => {
    console.log("yes it reacch")
    try {
        const { id: userId } = req.user;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const { ids } = req.body;
        console.log(ids)

        // const existingForm = await prisma.forms.findUnique({
        //     where: { id: formId },
        // });

        const forms = await prisma.forms.deleteMany({
            where: { userId: userId, id: { in: ids } },

        });
        console.log(forms)
        res.status(200).json("hellog");
    } catch (error) {
        console.error("Error updating form:", error);
        res.status(500).json({ error: "Failed to update form", details: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { id: userId } = req.user;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        console.log(req.body)
        const { firstName, lastName } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!existingUser) {
            return res.status(404).json({ error: 'Form not found' });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                firstName: firstName,
                lastName: lastName,
            },
        });
        console.log(updatedUser)
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        console.error("Error updating form:", error);
        res.status(500).json({ error: "Failed to update form", details: error.message });
    }
};


     






// export const upsertUserFromGoogle = async (googleUser) => {
//     const { email, name, sub: googleId } = googleUser;
//     const [firstName, ...lastNameParts] = name.split(' ');
//     const lastName = lastNameParts.join(' ');

//     try {
//         let user = await prisma.user.findUnique({
//             where: { email },
//         });

//         if (user) {
//             return user;
//         }

//         user = await prisma.user.create({
//             data: {
//                 email,
//                 firstName: firstName || '',
//                 lastName: lastName || ' ',
//                 password: `google-auth|${googleId}`,
//             },
//         });

//         return user;
//     } catch (error) {
//         console.error('Error in upsertUserFromGoogle:', error);
//         throw new Error('Failed to upsert user from Google');
//     }
// };
