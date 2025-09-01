import { Router } from 'express'
import { discoverMovie, discoverTv, trending } from '../controllers/tmdb.controller.js'

const router = Router()

router.get('/discover/movie', discoverMovie)
router.get('/discover/tv', discoverTv)
router.get('/trending/:media/:period', trending)

export default router
