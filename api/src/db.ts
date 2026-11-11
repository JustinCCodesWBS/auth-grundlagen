import mongoose from 'mongoose';

export async function connectDB() {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        throw new Error('MONGO_URI fehlt. Trage deine Verbindung in der .env-Datei ein.');
    }

    await mongoose.connect(uri, { dbName: 'raumklar_test' });
}
