import express from 'express';
import cors from 'cors';
import { connectDB } from './db.ts';
import { RouteNotFoundError } from './errors/RouteNotFoundError.ts';
import { errorHandler } from './middleware/errorHandler.ts';
import { requestLogger } from './middleware/requestLogger.ts';
import { drinkRoutes } from './routes/drinkRoutes.ts';

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(requestLogger);

app.use(cors({ origin: 'http://127.0.0.1:5500' }));
app.use(express.json());
app.use('/drinks', drinkRoutes);

app.use((_req, _res, next) => {
    next(new RouteNotFoundError());
});

app.use(errorHandler);

await connectDB();

app.listen(port, '127.0.0.1', () => {
    console.log('http://127.0.0.1:' + port);
});
