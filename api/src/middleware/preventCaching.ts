import type { RequestHandler } from 'express';

export const preventCaching: RequestHandler = (_req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
};
