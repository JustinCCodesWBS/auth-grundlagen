import mongoose from 'mongoose';
import { app } from './api.ts';
import { config } from './config.ts';
import { RefreshToken } from './models/RefreshToken.ts';
import { User } from './models/User.ts';

await mongoose.connect(config.MONGO_URI, { dbName: 'raumklar_test' });
await Promise.all([User.init(), RefreshToken.init()]);

app.listen(config.PORT, '127.0.0.1', () => {
    console.log('Drinks Auth Server läuft auf http://localhost:' + config.PORT);
});
