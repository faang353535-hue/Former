import { Router } from 'express';
import { router as userRouter } from './user.route.js';
import { router as googleRouter } from './login.route.js';

export const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

router.use('/user', userRouter);          
router.use('/auth', googleRouter);  