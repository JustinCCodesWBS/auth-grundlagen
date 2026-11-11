import { Schema, model } from 'mongoose';

const drinkSchema = new Schema({
    name: { type: String, required: true },
    onMenu: { type: Boolean, default: false },
});

export const Drink = model('Drink', drinkSchema, 'drinks');
