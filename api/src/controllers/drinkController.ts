import type { NextFunction, Request, Response } from 'express';
import { DrinkNotFoundError } from '../errors/DrinkNotFoundError.ts';
import { DrinkOnMenuError } from '../errors/DrinkOnMenuError.ts';
import { Drink } from '../models/Drink.ts';
import type { CreateDrinkBody, DrinkDTO, UpdateDrinkMenuBody } from '../schemas/drinkSchemas.ts';
import { toDrinkDTO } from '../serializers/drinkSerializer.ts';

export async function listDrinks(
    _req: Request,
    res: Response<DrinkDTO[]>,
    next: NextFunction,
) {
    try {
        const drinks = await Drink.find();
        res.json(drinks.map(toDrinkDTO));
    } catch (error) {
        next(error);
    }
}

export async function getDrink(
    req: Request<{ id: string }>,
    res: Response<DrinkDTO>,
    next: NextFunction,
) {
    try {
        const id = req.params.id;
        const drink = await Drink.findById(id);

        if (!drink) {
            throw new DrinkNotFoundError();
        }

        res.json(toDrinkDTO(drink));
    } catch (error) {
        next(error);
    }
}

export async function addDrink(
    req: Request<unknown, unknown, CreateDrinkBody>,
    res: Response<DrinkDTO>,
    next: NextFunction,
) {
    try {
        const drink = await Drink.create({ name: req.body.name });

        const output = toDrinkDTO(drink);

        res.location('/drinks/' + output._id);
        res.status(201).json(output);
    } catch (error) {
        next(error);
    }
}

export async function updateDrinkMenu(
    req: Request<{ id: string }, unknown, UpdateDrinkMenuBody>,
    res: Response<DrinkDTO>,
    next: NextFunction,
) {
    try {
        const { onMenu } = req.body;

        const drink = await Drink.findByIdAndUpdate(
            req.params.id,
            { $set: { onMenu } },
            { returnDocument: 'after' },
        );

        if (!drink) {
            throw new DrinkNotFoundError();
        }

        res.json(toDrinkDTO(drink));
    } catch (error) {
        next(error);
    }
}

export async function deleteDrink(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
) {
    try {
        const id = req.params.id;
        const result = await Drink.deleteOne({ _id: id, onMenu: { $ne: true } });

        if (result.deletedCount === 0) {
            const drinkExists = await Drink.exists({ _id: id });

            if (drinkExists) {
                throw new DrinkOnMenuError();
            }
        }

        res.status(204).end();
    } catch (error) {
        next(error);
    }
}
