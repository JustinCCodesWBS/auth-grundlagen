import { z } from 'zod/v4';

const email = z.string().trim().toLowerCase().pipe(z.email());
const password = z.string()
    .min(8, { error: 'Das Passwort braucht mindestens 8 Zeichen.' })
    .refine(value => Buffer.byteLength(value, 'utf8') <= 72, {
        error: 'Das Passwort darf höchstens 72 UTF-8-Bytes lang sein.',
    });

export const credentialsSchema = z.strictObject({ email, password });
export type Credentials = z.infer<typeof credentialsSchema>;
