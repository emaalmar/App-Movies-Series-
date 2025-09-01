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

// Configurar CORS
const corsOptions = {
    origin: CONFIG.CORS_ORIGIN,
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