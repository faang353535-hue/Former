import { Router } from 'express';
import { getAllUsers, register, login, logout, getProfile, createForm, getForms, updateForm, deleteForms, updateProfile, } from '../controllers/user.controller.js';
import { getForm, saveResponse, getResponses } from '../controllers/response.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

export const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.post('/create', authMiddleware, createForm);

router.get('/users', authMiddleware, getAllUsers);
router.get('/profile', authMiddleware, getProfile);
router.get('/forms', authMiddleware, getForms);

router.put('/updateForm/:id', authMiddleware, updateForm);
router.put('/update', authMiddleware, updateProfile);

router.delete('/delete', authMiddleware, deleteForms)  

//get form for anyone
router.post('/response', saveResponse);
router.get('/form/:id', getForm);
router.get('/responses/:id', getResponses)
