import helmet from "helmet"
import rateLimit from "express-rate-limit"
import cors from "cors"
import { CONFIG } from "../config/config.js"
import express from "express"

// Configurar rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

// Configurar CORS para múltiples orígenes
const allowedOrigins = CONFIG.CORS_ORIGIN.split(',').map(origin => origin.trim());
const corsOptions = {
    origin: function (origin, callback) {
        // Diagnostic logging for CORS decisions
        try {
            if (!origin) {
                console.log('[CORS] origin=null -> allow (no origin, e.g., Postman)');
                callback(null, true);
                return;
            }

            const lower = String(origin).toLowerCase();
            if (allowedOrigins.includes(origin)) {
                console.log(`[CORS] origin=${origin} -> allow (matched allowedOrigins)`);
                callback(null, true);
                return;
            }

            if (lower.endsWith('.vercel.app')) {
                console.log(`[CORS] origin=${origin} -> allow (vercel preview)`);
                callback(null, true);
                return;
            }

            console.log(`[CORS] origin=${origin} -> deny`);
            // Do not throw an error here — return false so CORS will
            // simply not set CORS headers for disallowed origins. If we
            // throw an Error the global error handler turns it into a 500.
            callback(null, false);
            return;
        } catch (err) {
            // Log unexpected errors in the CORS origin check
            console.error('[CORS] error while validating origin:', err && err.message ? err.message : err);
            // Deny on error but don't throw
            callback(null, false);
            return;
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

// Exportar array de middlewares
// Important: cors must be applied before the rate limiter so preflight (OPTIONS)
// requests receive the Access-Control-Allow-* headers even if rate limits are hit.
export const securityMiddleware = [
    helmet(),
    cors(corsOptions),
    limiter,
    express.json({ limit: '10kb' }),
    express.urlencoded({ extended: true })
];