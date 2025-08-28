import { Router } from 'express'
import { signup, signin, logout, profile } from '../controllers/auth.controller.js'
import {authMiddleware} from '../middlewares/authMiddleware.js'

const router = Router()
router.post('/signup', signup)
router.post('/signin', signin)
router.post('/logout', logout)
router.get('/profile', authMiddleware, profile)

export default router