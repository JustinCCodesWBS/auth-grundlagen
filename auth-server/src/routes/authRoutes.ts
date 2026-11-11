import { Router } from 'express';
import { credentialsSchema } from '../schemas/authSchemas.ts';
import { login, refresh, register } from '../controllers/authController.ts';
import { validateBody } from '../middleware/validateBody.ts';

export const authRoutes = Router();

authRoutes.post('/register', validateBody(credentialsSchema), register);
authRoutes.post('/login', validateBody(credentialsSchema), login);
authRoutes.post('/refresh', refresh);
