import express from "express"
import { CONFIG } from "./config/config.js"
import { securityMiddleware } from "./middleware/security.js"
import { connectDB } from "./database/mongoose.js"
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"

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

startServer();