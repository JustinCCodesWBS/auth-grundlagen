export class DrinkOnMenuError extends Error {
    constructor() {
        super('Nimm den Drink zuerst von der Getränkekarte.');
    }
}
