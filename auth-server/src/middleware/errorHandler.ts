import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod/v4';
import { AuthError } from '../errors/AuthError.ts';

export const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, next) => {
    if (res.headersSent) {
        next(error);
        return;
    }

    if (error instanceof AuthError) {
        res.status(error.status).json({ message: error.message });
        return;
    }

    if (error instanceof ZodError) {
        const issues = error.issues.map(issue => ({
            field: issue.path.join('.') || 'body',
            message: issue.message,
        }));
        res.status(400).json({ message: 'Ungültige Eingabedaten.', issues });
        return;
    }

    if (error instanceof Error && 'type' in error) {
        if (error.type === 'entity.parse.failed') {
            res.status(400).json({ message: 'Der Request-Body enthält ungültiges JSON.' });
            return;
        }

        if (error.type === 'entity.too.large') {
            res.status(413).json({ message: 'Der Request-Body ist zu groß.' });
            return;
        }
    }

    res.status(500).json({ message: 'Interner Serverfehler.' });
};
