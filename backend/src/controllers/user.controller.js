import bcrypt from 'bcryptjs';
import User from '../models/User.model.js';
import { z } from 'zod';
import jwt from 'jsonwebtoken';


export async function getMe(req, res) {
    try {
        const id = req.userId;
        const user = await User.findById(id)
        if(!user) return res.status(404).json({message: 'User not found'})
        return res.json({message: 'User retrieved successfully', user})
    } catch (error) {
        console.error('getMe error:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
}

// export async function updateMe(req, res) {
//     try {
//         const id = req.userID;
//         const updateData = req.body;

//         const validationResult = userSchema.safeParse(updateData);
//         if (!validationResult.success) {
//             return res.status(400).json({
//                 message: 'Validation failed',
//                 errors: validationResult.error.issues
//             });
//         }

//         const user = await User.findByIdAndUpdate(
//             id,
//             { $set: validationResult.data },
//             { new: true }
//         );

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         return res.json({ message: 'User updated successfully', user });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Error updating user' });
//     }
// }

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
export async function updateUserPassword(req, res) {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        user.passwordHash = await bcrypt.hash(newPassword, 10);
        await user.save();

        return res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating password' });
    }
}




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

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

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
