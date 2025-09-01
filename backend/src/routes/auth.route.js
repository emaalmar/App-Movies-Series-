import { Router } from 'express'
import { signup, signin, logout, profile } from '../controllers/auth.controller.js'
import { auth } from '../middleware/auth.js'

const router = Router()
router.post('/signup', signup)
router.post('/signin', signin)
router.post('/logout', logout)
router.get('/profile', auth, profile)

/* // ---- endpoint de prueba ----
router.get('/header', (req, res) => {
    const authHeader = req.get('Authorization') || ''
    const token = authHeader.replace(/^Bearer\s+/i, '')
    res.json({ authHeader, token })
}) */
/* Crea una nueva petición GET a
http://localhost:5000/api/auth/header
En la pestaña Headers añade:
Key: Authorization
Value: Bearer miTokenDePrueba123
Haz Send y verás en la respuesta algo como:
{ "authHeader": "Bearer miTokenDePrueba123", "token": "miTokenDePrueba123" } */
// ----------------------------

export default router