import cookieParser from 'cookie-parser';
import express from 'express';
import { AuthError } from './errors/AuthError.ts';
import { errorHandler } from './middleware/errorHandler.ts';
import { authRoutes } from './routes/authRoutes.ts';

export const app = express();

app.use((_req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

app.use(express.json({ limit: '16kb' }));
app.use(cookieParser());
app.use('/auth', authRoutes);
app.use((_req, _res, next) => {
    next(new AuthError(404, 'Route nicht gefunden.'));
});
app.use(errorHandler);
