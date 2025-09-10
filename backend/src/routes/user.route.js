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
} from '../controllers/user.controller.js';

const router = Router();

// Valida :id en rutas que lo requieran
router.param('id', (req, res, next, id) => {
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid id' });
    }
    next();
});

// Obtener todos los usuarios (admin)
router.get('/', auth, getUsers);

// Operaciones sobre usuario específico
router.get('/:id', auth, getUser);
router.put('/:id', auth, ensureOwnerOrAdmin, updateUser);
router.delete('/:id', auth, ensureOwnerOrAdmin, deleteUser);

// Actualizar contraseña de usuario
router.put('/:id/password', auth, ensureOwnerOrAdmin, updateUserPassword);

export default router;
