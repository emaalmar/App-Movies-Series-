import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
    try {
        // Check if authorization header exists
        if (!req.headers.authorization) {
            return res.status(401).json({
                message: 'Authorization header is required'
            });
        }

        const authHeader = req.headers.authorization;

        // Validate Bearer token format
        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Invalid authorization format. Use: Bearer <token>'
            });
        }

        // Extract token
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                message: 'Token is required'
            });
        }

        // Verify token
        const payload = jwt.verify(token, process.env.SECRET_KEY);

        // Validate payload
        if (!payload || typeof payload !== 'object') {
            return res.status(401).json({
                message: 'Invalid token payload'
            });
        }

        // Extract user ID consistently
        const userId = payload.sub || payload._id || payload.id;

        if (!userId) {
            return res.status(401).json({
                message: 'Token payload must contain user ID'
            });
        }

        req.userId = userId;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                message: 'Invalid token',
                error: error.message
            });
        }
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                message: 'Token has expired'
            });
        }
        return res.status(500).json({
            message: 'Internal server error during authentication'
        });
    }
};