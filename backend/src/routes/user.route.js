import { Router } from 'express';
import { isValidObjectId } from 'mongoose';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import {
    updateUser,
    getUser,
    deleteUser,
    getUsers,
    // updateMe //
} from '../controllers/user.controller.js';

import { profile } from '../controllers/auth.controller.js';

const router = Router();

/** Middleware reutilizable para mapear /me -> :id */
const aliasMeToId = (req, res, next) => {
    const userId = req.userId;
    if (!userId || !isValidObjectId(userId)) {
        return res.status(400).json({ message: 'Invalid user id in token' });
    }
    req.params.id = userId;
    next();
};

/** Valida :id (solo aplica en rutas que tienen :id en el path) */
router.param('id', (req, res, next, id) => {
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid id' });
    }
    next();
});

// --- Rutas “me” ---
router.get('/me', authMiddleware, profile);
router.put('/me', authMiddleware, aliasMeToId, updateUser);
router.delete('/me', authMiddleware, aliasMeToId, deleteUser);

// --- Rutas admin/otros (por :id) ---
router.get('/', authMiddleware, getUsers);

router
    .route('/:id')
    .get(authMiddleware, getUser)
    .put(authMiddleware, updateUser)
    .delete(authMiddleware, deleteUser);

export default router;
