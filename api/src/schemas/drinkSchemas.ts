import { z } from 'zod/v4';

const drinkIdSchema = z.string().regex(/^[0-9a-f]{24}$/i, {
    error: 'Die Drink-ID muss aus 24 Hexzeichen bestehen.',
});

export const drinkParamsSchema = z.object({
    id: drinkIdSchema,
});

export const createDrinkSchema = z.strictObject({
    name: z.string({ error: 'Name muss ein Text sein.' })
        .trim()
        .min(1, { error: 'Name darf nicht leer sein.' }),
});

export const updateDrinkMenuSchema = z.strictObject({
    onMenu: z.boolean({ error: 'onMenu muss true oder false sein.' }),
});

export const drinkOutputSchema = z.strictObject({
    _id: drinkIdSchema,
    name: z.string(),
    onMenu: z.boolean(),
});

export type DrinkDTO = z.infer<typeof drinkOutputSchema>;
export type CreateDrinkBody = z.infer<typeof createDrinkSchema>;
export type UpdateDrinkMenuBody = z.infer<typeof updateDrinkMenuSchema>;
