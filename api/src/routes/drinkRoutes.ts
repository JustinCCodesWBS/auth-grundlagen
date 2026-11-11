import { Router } from 'express';
import {
    listDrinks,
    getDrink,
    addDrink,
    updateDrinkMenu,
    deleteDrink,
} from '../controllers/drinkController.ts';
import { preventCaching } from '../middleware/preventCaching.ts';
import { requireAccessToken } from '../middleware/requireAccessToken.ts';
import { validateBody } from '../middleware/validateBody.ts';
import {
    createDrinkSchema,
    drinkParamsSchema,
    updateDrinkMenuSchema,
} from '../schemas/drinkSchemas.ts';

export const drinkRoutes = Router();

drinkRoutes.use(preventCaching);

drinkRoutes.param('id', (req, _res, next) => {
    const result = drinkParamsSchema.safeParse(req.params);

    if (!result.success) {
        next(result.error);
        return;
    }

    next();
});

drinkRoutes.get('/', listDrinks);
drinkRoutes.get('/:id', getDrink);
drinkRoutes.post('/', requireAccessToken, validateBody(createDrinkSchema), addDrink);
drinkRoutes.patch('/:id/menu', requireAccessToken, validateBody(updateDrinkMenuSchema), updateDrinkMenu);
drinkRoutes.delete('/:id', requireAccessToken, deleteDrink);
