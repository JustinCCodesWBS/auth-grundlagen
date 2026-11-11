import { createHash, randomUUID } from 'node:crypto';
import type { Response } from 'express';
import jwt from 'jsonwebtoken';
import type { Types } from 'mongoose';
import { config } from '../config.ts';
import { RefreshToken } from '../models/RefreshToken.ts';

// Konstanten (wie in der Lecture erklärt hier etwas overkill, aber um das Prinzip zu erklären hilfreich)
// Wir weisen REFRESH_COOKIE den Text 'refreshToken' zu, damit der Server den Cookie beim Setzen und Auslesen unter demselben Namen findet
export const REFRESH_COOKIE = 'refreshToken';
const ACCESS_TOKEN_SECONDS = 15 * 60;
const REFRESH_TOKEN_MS = 7 * 24 * 60 * 60 * 1000;

export function hashRefreshToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
}

export async function createTokens(user: { _id: Types.ObjectId; roles: string[] }) {
    const accessToken = jwt.sign({ roles: user.roles }, config.ACCESS_TOKEN_SECRET, {
        algorithm: 'HS256',
        subject: user._id.toHexString(),
        expiresIn: ACCESS_TOKEN_SECONDS,
        issuer: 'drinks-auth',
        audience: 'drinks-api',
    });

    const refreshToken = randomUUID();

    await RefreshToken.create({
        tokenHash: hashRefreshToken(refreshToken),
        userId: user._id,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_MS),
    });

    return { accessToken, refreshToken };
}

export function setAuthCookie(res: Response, refreshToken: string) {
    res.cookie(REFRESH_COOKIE, refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/auth',
        maxAge: REFRESH_TOKEN_MS,
    });
}
