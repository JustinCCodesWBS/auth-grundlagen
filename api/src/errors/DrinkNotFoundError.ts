export class DrinkNotFoundError extends Error {
    constructor() {
        super('Drink nicht gefunden.');
    }
}
