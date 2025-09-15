import { Router } from 'express'
import { signup, signin, logout, profile } from '../controllers/auth.controller.js'
import { auth } from '../middleware/auth.js'
import { profileValidator, signinValidator, signupValidator } from '../validators/auth.validator.js'
import { handleValidator } from '../middleware/handleValidator.js'

const router = Router()
router.post('/signup', signupValidator, handleValidator, signup)
router.post('/signin', signinValidator, handleValidator, signin)
router.post('/logout', logout)
router.get('/profile', auth, profileValidator, handleValidator, profile)

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