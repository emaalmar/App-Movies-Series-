import mongoose from "mongoose"
import { CONFIG } from "../config/config.js"

export const connectDB = async () => {
    try {
        await mongoose.connect(CONFIG.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
    } catch (err) {
        console.error('MongoDB connection error:', err);
        throw err;
    }
};