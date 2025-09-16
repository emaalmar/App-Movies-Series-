import express from "express"
import { CONFIG } from "./config/config.js"
import { securityMiddleware } from "./middleware/security.js"
import { connectDB } from "./database/mongoose.js"
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import tmdbRoutes from './routes/tmdb.route.js'

const app = express();

// When the app is running behind a proxy (like Vercel) Express must be
// told to trust the proxy so middleware that relies on the client's IP
// (such as express-rate-limit) can read the correct address from
// the X-Forwarded-For header. Setting to 1 trusts the first proxy.
if (process.env.VERCEL || CONFIG.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// Validar configuración
if (!CONFIG.MONGODB_URI || !CONFIG.SECRET_KEY) {
    throw new Error('Critical environment variables are missing');
}

// Aplicar middlewares
securityMiddleware.forEach(middleware => app.use(middleware));

// Rutas
app.get('/favicon.ico', (req, res) => res.status(204).send());
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

// Export the app for serverless platforms (top-level export)
export default app;

// When running locally (not on Vercel) start DB connection and HTTP server
if (!process.env.VERCEL) {
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
}

// If running on Vercel (serverless) initiate a DB connection at module load
// so handlers can use mongoose during cold starts. We don't call app.listen
// because Vercel provides the HTTP server.
if (process.env.VERCEL) {
    connectDB()
        .then(() => console.log('MongoDB connected (vercel)'))
        .catch(err => console.error('MongoDB connection error (vercel):', err));
}