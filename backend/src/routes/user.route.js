import { Router } from 'express';
import { isValidObjectId } from 'mongoose';
import { auth } from '../middleware/auth.js';
import { ensureOwnerOrAdmin } from '../middleware/ensureOwnerOrAdmin.js';

import {
    updateUser,
    getUser,
    deleteUser,
    getUsers,
    updateUserPassword,
    // getMe moved to auth.controller as profile
    // updateMe //
} from '../controllers/user.controller.js';

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

// NOTE: /me routes removed — frontend should use GET /api/auth/profile for session
// and call /users/:id for mutating operations. Alias middleware kept for legacy use.

// --- Rutas admin/otros (por :id) ---
router.get('/', auth, getUsers);

router
    .route('/:id')
    .get(auth, getUser)
    .put(auth, auth, ensureOwnerOrAdmin, updateUser)
    .delete(auth, auth, ensureOwnerOrAdmin, deleteUser);

router.put('/:id/password', auth, ensureOwnerOrAdmin, updateUserPassword);

export default router;
