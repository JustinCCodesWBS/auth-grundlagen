import type { Types } from 'mongoose';
import { drinkOutputSchema, type DrinkDTO } from '../schemas/drinkSchemas.ts';

type DrinkForOutput = {
    _id: Types.ObjectId;
    name: string;
    onMenu: boolean;
};

export function toDrinkDTO(drink: DrinkForOutput): DrinkDTO {
    const result = drinkOutputSchema.safeParse({
        _id: drink._id.toHexString(),
        name: drink.name,
        onMenu: drink.onMenu,
    });

    if (!result.success) {
        throw new Error('Die Drink-Ausgabe entspricht nicht dem API-Schema.', {
            cause: result.error,
        });
    }

    return result.data;
}
