import { z } from 'zod'
import bcrypt from 'bcryptjs'
import User from '../models/User.model.js'
import jwt from 'jsonwebtoken'
import RevokedToken from '../models/RevokedToken.model.js'

const signupSchema = z.object({
    fullName: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
    email: z.string().email('Correo electrónico inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').max(100)
        .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
        .regex(/[0-9]/, 'La contraseña debe contener al menos un número')
})

export async function signup(req, res) {
    try {
    const { fullName, email, password } = signupSchema.parse(req.body)
    const normalizedEmail = email.trim().toLowerCase()

    const exists = await User.findOne({ email: normalizedEmail })
        if (exists) return res.status(409).json({ message: 'El correo ya está registrado' })

        const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ fullName, email: normalizedEmail, passwordHash })

        const token = jwt.sign({ sub: user._id, email: user.email }, process.env.SECRET_KEY, { expiresIn: '7d' })

        return res.status(201).json({ message: 'Usuario creado', token })
    } catch (err) {
        // Si es error de validación Zod
        if (err?.name === 'ZodError' && err?.issues) {
            const msg = err.issues[0]?.message;
            return res.status(400).json({ message: msg || 'Datos inválidos' });
        }
        // Si es error de email duplicado (MongoDB)
        if (err?.code === 11000) {
            return res.status(409).json({ message: 'El correo ya está registrado' });
        }
        console.error(err);
        return res.status(500).json({ message: 'Error interno' });
    }
}


const signinSchema = z.object({
    email: z.string().email("Correo electrónico inválido"),
    password: z.string().min(6,"Contraseña requerida")
});

export async function signin(req, res) {
    const parsed = signinSchema.safeParse(req.body)
    if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.issues[0]?.message || 'Datos inválidos' })
    }

    const email = parsed.data.email.trim().toLowerCase()
    const password = parsed.data.password

    try {
        const user = await User.findOne({ email })
        if (!user) return res.status(401).json({ message: 'Usuario o contraseña incorrectos' })

        const isMatch = await bcrypt.compare(password, user.passwordHash)
        if (!isMatch) return res.status(401).json({ message: 'Usuario o contraseña incorrectos' })

        const token = jwt.sign({ sub: user._id, email: user.email }, process.env.SECRET_KEY, { expiresIn: '7d' })
        return res.status(200).json({ message: 'Inicio de sesión exitoso', token })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Error interno' })
    }
}

export async function logout(req, res) {
    try {
        const authHeader = req.headers.authorization || ''
        if (!authHeader.startsWith('Bearer ')) return res.status(400).json({ message: 'Invalid authorization header' })

        const token = authHeader.split(' ')[1]
        if (!token) return res.status(400).json({ message: 'Token is required' })

        // Decode token to get expiration
        const decoded = jwt.decode(token)
        if (!decoded || !decoded.exp) {
            return res.status(400).json({ message: 'Invalid token' })
        }

        // exp is in seconds since epoch
        const expiresAt = new Date(decoded.exp * 1000)

        await RevokedToken.create({ token, expiresAt })
        return res.status(200).json({ message: 'Logged out successfully' })
    } catch (err) {
        console.error('logout error:', err)
        return res.status(500).json({ message: 'Error interno' })
    }
}

export async function profile(req, res) {
    try {
        const userId = req.userId
        if (!userId) return res.status(400).json({ message: 'User id missing in token' })

        const user = await User.findById(userId)
        if (!user) return res.status(404).json({ message: 'User not found' })

        return res.status(200).json({ message: 'Profile retrieved', user })
    } catch (err) {
        console.error('profile error:', err)
        return res.status(500).json({ message: 'Error interno' })
    }
}