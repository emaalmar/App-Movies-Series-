import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    try {
        let token;

        // Buscar token en cookies
        if (req.cookies?.token) {
            token = req.cookies.token;
        }

        // Buscar token en Authorization header
        else if (req.headers.authorization?.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Without token' });
        }

        // Verificar token
        const payload = jwt.verify(token, process.env.SECRET_KEY);

        // Validar payload
        if (!payload || typeof payload !== 'object') {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Extraer ID de usuario
        const userId = payload.sub || payload._id || payload.id;
        if (!userId) {
            return res.status(401).json({ message: 'Token without user ID' });
        }

        // Guardar usuario en la request
        req.user = { id: userId, email: payload.email };
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Token expired' });
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Invalid token', error: error.message });
        }
        return res.status(500).json({ message: 'Internal authentication error' });
    }
};
