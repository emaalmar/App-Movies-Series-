import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import { config } from "dotenv"
import authRoutes from "./routes/auth.route.js"


config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const CORS_ORIGIN = process.env.CORS_ORIGIN;


if (!MONGODB_URI) {
    console.error('Falta MONGODB_URI en .env')
    process.exit(1)
}

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.get('/health', (_, res) => res.json({ ok: true }));


try {
    await mongoose.connect(MONGODB_URI)
    console.log('MongoDB connected')
} catch (err) {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
}
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});