import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true, select: false },
    roles: { type: [String], default: ['user'] },
});

export const User = model('User', userSchema, 'drinks_auth_users');
