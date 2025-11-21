import jwt from 'jsonwebtoken';
import prisma from '../../lib/prisma.js';

const authMiddleware = async (req, res, next) => {
    console.log('authMiddleware: called');
    try {
        const token = req.cookies.jwt;

        console.log('authMiddleware: received token?', !!token);
        if (!token) {
            console.log('authMiddleware: no token found in cookies');
            return res.status(401).json({ error: 'Authentication required' });
        }

        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("=====|", decoded);

        } catch (err) {
            console.log("=====|", err);
            console.log('authMiddleware: token verify failed', err && err.message);
            return res.status(401).json({ error: 'Invalid token' });
        }

        console.log('authMiddleware: token decoded id=', decoded.id);
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                picture: true,
            }
        });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

export default authMiddleware;