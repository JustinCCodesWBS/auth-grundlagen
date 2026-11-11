import type { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod/v4';
import { DrinkNotFoundError } from '../errors/DrinkNotFoundError.ts';
import { DrinkOnMenuError } from '../errors/DrinkOnMenuError.ts';
import { RouteNotFoundError } from '../errors/RouteNotFoundError.ts';

export const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, next) => {
    if (res.headersSent) {
        next(error);
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

    if (error instanceof DrinkNotFoundError || error instanceof RouteNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
    }

    if (error instanceof DrinkOnMenuError) {
        res.status(409).json({ message: error.message });
        return;
    }

    if (error instanceof mongoose.Error.ValidationError) {
        res.status(400).json({ message: 'Ein gültiger Name ist erforderlich.' });
        return;
    }

    if (error instanceof Error && 'type' in error) {
        switch (error.type) {
            case 'entity.parse.failed':
                res.status(400).json({ message: 'Der Request-Body enthält ungültiges JSON.' });
                return;
            case 'entity.too.large':
                res.status(413).json({ message: 'Der Request-Body ist zu groß.' });
                return;
            case 'charset.unsupported':
            case 'encoding.unsupported':
                res.status(415).json({ message: 'Der Request-Body verwendet eine nicht unterstützte Kodierung.' });
                return;
        }
    }

    res.status(500).json({ message: 'Interner Serverfehler.' });
};
