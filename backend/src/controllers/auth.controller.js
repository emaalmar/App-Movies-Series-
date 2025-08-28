import { z } from 'zod'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.model.js'

const signupSchema = z.object({
    fullName: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
    email: z.string().email('Correo electrónico inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').max(100)
        .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
        .regex(/[0-9]/, 'La contraseña debe contener al menos un número')
})

const signinSchema = z.object({
    email: z.string().email('Correo electrónico inválido'),
    password: z.string().min(6, 'Contraseña requerida')
})


export async function signup(req, res) {
    try {
        const { fullName, email, password } = signupSchema.parse(req.body)

        const exists = await User.findOne({ email })
        if (exists) return res.status(409).json({ message: 'El correo ya está registrado' })

        const passwordHash = await bcrypt.hash(password, 10)
        // CAMBIO: guarda passwordHash en el campo correcto
        const user = await User.create({ fullName, email, passwordHash })

        jwt.sign({ id: user._id, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: '1d' },
            (err, token) => {
                if (err) return res.status(500).json({ message: 'Error al generar el token' })
                res.cookie('token', token, {
                    httpOnly: true,
                    sameSite: 'lax',
                    secure: false // true si usas HTTPS
                });
                res.json({
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                })

            }
        )
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

export async function signin(req, res) {
    const parsed = signinSchema.safeParse(req.body)
    if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.issues[0]?.message || 'Datos inválidos' })
    }

    const email = parsed.data.email.trim().toLowerCase()
    const password = parsed.data.password

    try {
        const user = await User.findOne({ email })
        if (!user) {
            console.log('No existe usuario para el email:', email);
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' })
        }

        // CAMBIO: usar passwordHash
        if (!user.passwordHash || typeof user.passwordHash !== 'string') {
            console.log('El usuario existe pero no tiene contraseña válida:', user);
            return res.status(500).json({ message: 'Usuario mal registrado o datos corruptos' });
        }

        if (!password || typeof password !== 'string') {
            console.log('Contraseña recibida del frontend no válida:', password);
            return res.status(400).json({ message: 'Contraseña inválida' });
        }

        // CAMBIO: comparar con passwordHash
        const isMatch = await bcrypt.compare(password, user.passwordHash)
        if (!isMatch) return res.status(401).json({ message: 'Usuario o contraseña incorrectos' })

        jwt.sign({ id: user._id, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: '1d' },
            (err, token) => {
                if (err) return res.status(500).json({ message: 'Error al generar el token' })
                res.cookie('token', token, {
                    httpOnly: true,
                    sameSite: 'lax',
                    secure: false // true si usas HTTPS
                });
                res.json({
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                })
            }
        )
    } catch (err) {
        console.error('Error en signin:', err)
        return res.status(500).json({ message: 'Error interno' })
    }
}

export async function logout(req, res) {
    res.cookie('token', "", {
        expires: new Date(0),
    })
    return res.status(200).json({ message: 'Sesión cerrada' })
}

export async function profile(req, res) {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Destructuramos los campos que queremos devolver
        const { _id, fullName, email, createdAt, updatedAt } = user;

        return res.status(200).json({
            message: 'Perfil obtenido correctamente',
            user: {
                id: _id,
                fullName,
                email,
                createdAt,
                updatedAt
            }
        });
    } catch (error) {
        console.error('profile error:', error);
        return res.status(500).json({
            message: 'Error interno del servidor',
            error: error.message
        });
    }
}