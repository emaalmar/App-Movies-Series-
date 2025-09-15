import { validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import User from '../models/User.model.js'
import jwt from 'jsonwebtoken'
import RevokedToken from '../models/RevokedToken.model.js'


export async function signup(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0]?.msg || 'Datos inválidos' })
    }
    try {
        const { fullName, email, password } = req.body
        const normalizedEmail = email.trim().toLowerCase()

        const exists = await User.findOne({ email: normalizedEmail })
        if (exists) return res.status(409).json({ message: 'El correo ya está registrado' })

        const passwordHash = await bcrypt.hash(password, 10)
        const user = await User.create({ fullName, email: normalizedEmail, passwordHash })

        const token = jwt.sign({ sub: user._id, email: user.email }, process.env.SECRET_KEY, { expiresIn: '7d' })
        return res.status(201).json({ message: 'Usuario creado', token, user })
    } catch (err) {
        if (err?.code === 11000) {
            return res.status(409).json({ message: 'El correo ya está registrado' })
        }
        console.error(err)
        return res.status(500).json({ message: 'Error interno' })
    }
}



export async function signin(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0]?.msg || 'Datos inválidos' })
    }

    const email = req.body.email.trim().toLowerCase()
    const password = req.body.password

    try {
        const user = await User.findOne({ email })
        if (!user) return res.status(401).json({ message: 'Usuario o contraseña incorrectos' })

        const isMatch = await bcrypt.compare(password, user.passwordHash)
        if (!isMatch) return res.status(401).json({ message: 'Usuario o contraseña incorrectos' })

        const token = jwt.sign({ sub: user._id, email: user.email }, process.env.SECRET_KEY, { expiresIn: '7d' })
        return res.status(200).json({ message: 'Inicio de sesión exitoso', token, user })
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