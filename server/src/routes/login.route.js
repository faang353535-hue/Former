import { Router } from 'express';
import { startGoogleAuth, googleLoginCallback, } from '../controllers/google.controller.js';
import { startGithubAuth, githubLoginCallback, } from '../controllers/github.controller.js';

export const router = Router();

//Auth0 
router.get('/google/start', startGoogleAuth);
router.get('/google/login', googleLoginCallback);
router.get('/github/start', startGithubAuth);
router.get('/github/login', githubLoginCallback);  

export default router;         