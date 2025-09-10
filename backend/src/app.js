import express from "express"
import { CONFIG } from "./config/config.js"
import { securityMiddleware } from "./middleware/security.js"
import { connectDB } from "./database/mongoose.js"
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import tmdbRoutes from './routes/tmdb.route.js'

const app = express();

// Validar configuración
if (!CONFIG.MONGODB_URI || !CONFIG.SECRET_KEY) {
    throw new Error('Critical environment variables are missing');
}

// Aplicar middlewares
securityMiddleware.forEach(middleware => app.use(middleware));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use('/api/tmdb', tmdbRoutes)
app.get('/health', (_, res) => res.json({ ok: true }));

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({ message: 'Something went wrong!' });
});

const startServer = async () => {
    try {
        await connectDB();
        app.listen(CONFIG.PORT, () => {
            console.log(`Server is running on port ${CONFIG.PORT}`);
        });
    } catch (err) {
        console.error("Failed to connect to the database:", err.message);
        process.exit(1); // Exit the process if DB connection fails
    }
};

startServer();import express from "express"
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