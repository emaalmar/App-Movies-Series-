import bcrypt from 'bcryptjs';
import User from '../models/User.model.js';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

/**
 * Retrieves a paginated list of users.
 */
export async function getUsers(req, res) {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const users = await User.find().skip(skip).limit(limit);
        const totalUsers = await User.countDocuments();

        return res.json({
            message: 'Users retrieved successfully',
            users,
            page,
            limit,
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving users' });
    }
}

/**
 * Retrieves a single user by ID.
 */
export async function getUser(req, res) {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json({ message: 'User retrieved successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving user' });
    }
}

/**
 * Updates a user's password after verifying the current password.
 */

const userSchema = z.object({
    fullName: z.string().min(2),
    email: z.string().email()
}).partial();
/**
 * Updates user information except for the password hash.
 */
export async function updateUser(req, res) {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Obtener el usuario autenticado
        const authenticatedUserId = req.userId;
        // Buscar el usuario que se va a modificar
        const userToUpdate = await User.findById(id);
        if (!userToUpdate) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Permitir solo si el usuario autenticado es el dueño o es admin
        if (authenticatedUserId !== id && userToUpdate.role !== 'admin') {
            return res.status(403).json({ message: 'No tienes permiso para modificar este usuario' });
        }

        const validationResult = userSchema.safeParse(updateData);

        if (!validationResult.success) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: validationResult.error.issues
            });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { $set: validationResult.data },
            { new: true }
        );

        return res.json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating user' });
    }
}

/**
 * Deletes a user by ID.
 */
export async function deleteUser(req, res) {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting user' });
    }
}
