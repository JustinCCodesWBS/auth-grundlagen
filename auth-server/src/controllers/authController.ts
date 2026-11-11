import bcrypt from 'bcrypt';
import type { RequestHandler } from 'express';
import { mongo } from 'mongoose';
import { z } from 'zod/v4';
import { AuthError } from '../errors/AuthError.ts';
import type { Credentials } from '../schemas/authSchemas.ts';
import { REFRESH_COOKIE, createTokens, hashRefreshToken, setAuthCookie } from '../auth/tokens.ts';
import { RefreshToken } from '../models/RefreshToken.ts';
import { User } from '../models/User.ts';


// Konstanten (wie in der Lecture erklärt hier etwas overkill, aber um das Prinzip zu erklären hilfreich)
type TokenResponse = { accessToken: string };
type CredentialsHandler = RequestHandler<unknown, TokenResponse, Credentials>;
const DUPLICATE_EMAIL = 'Zu dieser E-Mail existiert bereits ein Konto.';
const INVALID_CREDENTIALS = 'E-Mail oder Passwort ist ungültig.';
const INVALID_REFRESH = 'Refresh Token fehlt oder ist ungültig.';
const refreshCookieSchema = z.uuid();

export const register: CredentialsHandler = async (req, res) => {
    const { email, password } = req.body;

    if (await User.exists({ email })) {
        throw new AuthError(409, DUPLICATE_EMAIL);
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, passwordHash }).catch((error: unknown) => {
        if (error instanceof mongo.MongoServerError && error.code === 11000) {
            throw new AuthError(409, DUPLICATE_EMAIL);
        }

        throw error;
    });

    const { accessToken, refreshToken } = await createTokens(user);
    setAuthCookie(res, refreshToken);
    res.status(201).json({ accessToken });
};

export const login: CredentialsHandler = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+passwordHash');

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        throw new AuthError(401, INVALID_CREDENTIALS);
    }

    await RefreshToken.deleteMany({ userId: user._id });

    const { accessToken, refreshToken } = await createTokens(user);
    setAuthCookie(res, refreshToken);
    res.json({ accessToken });
};

export const refresh: RequestHandler<unknown, TokenResponse> = async (req, res) => {
    const parsed = refreshCookieSchema.safeParse(req.cookies[REFRESH_COOKIE]);

    if (!parsed.success) {
        throw new AuthError(401, INVALID_REFRESH);
    }

    const storedToken = await RefreshToken.findOneAndDelete({
        tokenHash: hashRefreshToken(parsed.data),
        expiresAt: { $gt: new Date() },
    });

    if (!storedToken) {
        throw new AuthError(401, INVALID_REFRESH);
    }

    const user = await User.findById(storedToken.userId);

    if (!user) {
        throw new AuthError(401, INVALID_REFRESH);
    }

    const { accessToken, refreshToken } = await createTokens(user);
    setAuthCookie(res, refreshToken);
    res.json({ accessToken });
};
