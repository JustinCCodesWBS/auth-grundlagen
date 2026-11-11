import { z } from 'zod/v4';

const configSchema = z.object({
    MONGO_URI: z.string().min(1),
    ACCESS_TOKEN_SECRET: z.string().min(32),
    PORT: z.coerce.number().int().min(1).max(65535).default(3001),
});

const result = configSchema.safeParse(process.env);

if (!result.success) {
    const fields = result.error.issues.map(issue => issue.path.join('.'));
    throw new Error('Prüfe diese Einträge in .env: ' + fields.join(', '));
}

export const config = result.data;
