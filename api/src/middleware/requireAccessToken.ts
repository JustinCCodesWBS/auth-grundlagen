import type { RequestHandler } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';

const secret = process.env.ACCESS_TOKEN_SECRET;

if (!secret || secret.length < 32) {
    throw new Error('Trage in der .env denselben ACCESS_TOKEN_SECRET wie im Auth-Server ein (mindestens 32 Zeichen).');
}

export const requireAccessToken: RequestHandler = (req, res, next) => {
    const token = req.get('Authorization')?.match(/^Bearer +(\S+)$/i)?.[1];

    if (!token) {
        res.set('WWW-Authenticate', 'Bearer').status(401).json({ message: 'Access Token fehlt oder hat ein ungültiges Format.' });
        return;
    }

    let payload: string | JwtPayload | undefined;

    try {
        payload = jwt.verify(token, secret, {
            algorithms: ['HS256'],
            issuer: 'drinks-auth',
            audience: 'drinks-api',
        });
    } catch (error) {
        if (!(error instanceof jwt.JsonWebTokenError)) {
            next(error);
            return;
        }
    }

    if (typeof payload !== 'object' || typeof payload.sub !== 'string' || !payload.sub || !Number.isFinite(payload.exp)) {
        res.set('WWW-Authenticate', 'Bearer error="invalid_token"').status(401).json({ message: 'Access Token ist ungültig oder abgelaufen.' });
        return;
    }

    next();
};
