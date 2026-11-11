export class RouteNotFoundError extends Error {
    constructor() {
        super('Route nicht gefunden.');
    }
}
