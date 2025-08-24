import { z } from 'zod'
import bcrypt from 'bcryptjs'
import User from '../models/User.model.js'

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

        const exists = await User.findOne({ email })
        if (exists) return res.status(409).json({ message: 'El correo ya está registrado' })

        const passwordHash = await bcrypt.hash(password, 10)
        await User.create({ fullName, email, passwordHash })

        return res.status(201).json({ message: 'Usuario creado' })
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
    password: z.string().min(6, "La contraseña es requerida'")
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

        // Opcional: emitir JWT
        // import jwt from 'jsonwebtoken'
        // const token = jwt.sign({ sub: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' })
        // return res.status(200).json({ message: 'Inicio de sesión exitoso', token })
        return res.status(200).json({ message: 'Inicio de sesión exitoso' })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Error interno' })
    }
}