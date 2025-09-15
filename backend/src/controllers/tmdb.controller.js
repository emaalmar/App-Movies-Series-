import { CONFIG } from '../config/config.js'

const TMDB_BASE = 'https://api.themoviedb.org/3'

// Simple in-memory cache: key -> { expiresAt: ms, data }
const cache = new Map()

function getCache(key) {
    const entry = cache.get(key)
    if (!entry) return null
    if (Date.now() > entry.expiresAt) {
        cache.delete(key)
        return null
    }
    return entry.data
}

function setCache(key, data, ttlSeconds = 60) {
    cache.set(key, { data, expiresAt: Date.now() + ttlSeconds * 1000 })
}

async function tmdbFetch(path, params = {}) {
    const buildUrl = (useApiKey = false) => {
        const url = new URL(`${TMDB_BASE}${path}`)
        Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
        if (useApiKey) url.searchParams.set('api_key', CONFIG.TMDB_API_KEY)
        return url
    }

    // First attempt: use Bearer (v4) token in Authorization header
    const doFetch = async (urlStr, withAuth = true) => {
        const headers = { 'Content-Type': 'application/json' }
        if (withAuth) headers.Authorization = `Bearer ${CONFIG.TMDB_API_KEY}`
        const r = await fetch(urlStr, { headers })
        const txt = await r.text()
        let j = null
        try { j = JSON.parse(txt) } catch { /* allow raw text */ }
        return { res: r, text: txt, json: j }
    }

    const firstUrl = buildUrl().toString()
    const first = await doFetch(firstUrl, true)
    if (first.res.ok) return first.json || first.text

    // If bearer token fails because it's the wrong key type, try fallback using api_key query param
    const statusCode = first.json && first.json.status_code
    if (first.res.status === 401 || first.res.status === 403 || statusCode === 7) {
        console.warn('TMDB: bearer auth failed, retrying with api_key param', { status: first.res.status, payload: first.json || first.text })
        const secondUrl = buildUrl(true).toString()
        const second = await doFetch(secondUrl, false)
        if (second.res.ok) return second.json || second.text

        const err2 = new Error('TMDB response not OK (api_key fallback)')
        err2.status = second.res.status
        err2.payload = second.json || second.text
        throw err2
    }

    const err = new Error('TMDB response not OK (bearer)')
    err.status = first.res.status
    err.payload = first.json || first.text
    throw err
}

export async function discoverMovie(req, res) {
    try {
    const key = `/discover/movie?${new URLSearchParams(req.query).toString()}`
    const cached = getCache(key)
    if (cached) return res.json(cached)
        const data = await tmdbFetch('/discover/movie', req.query)
    setCache(key, data, 60)
        return res.json(data)
    } catch (err) {
        console.error('tmdb discoverMovie error', err)
        if (err.status === 429) {
            return res.status(429).json({ message: 'TMDB rate limit', details: err.payload })
        }
        return res.status(500).json({ message: 'Error fetching from TMDB', details: err.payload || err.message })
    }
}

export async function discoverTv(req, res) {
    try {
    const key = `/discover/tv?${new URLSearchParams(req.query).toString()}`
    const cached = getCache(key)
    if (cached) return res.json(cached)
        const data = await tmdbFetch('/discover/tv', req.query)
    setCache(key, data, 60)
        return res.json(data)
    } catch (err) {
        console.error('tmdb discoverTv error', err)
        if (err.status === 429) {
            return res.status(429).json({ message: 'TMDB rate limit', details: err.payload })
        }
        return res.status(500).json({ message: 'Error fetching from TMDB', details: err.payload || err.message })
    }
}

export async function trending(req, res) {
    try {
        // path example: /trending/movie/day
        const { media = 'movie', period = 'day' } = req.params
    const key = `/trending/${media}/${period}?${new URLSearchParams(req.query).toString()}`
    const cached = getCache(key)
    if (cached) return res.json(cached)
        const data = await tmdbFetch(`/trending/${media}/${period}`, req.query)
    setCache(key, data, 60)
        return res.json(data)
    } catch (err) {
        console.error('tmdb trending error', err)
        if (err.status === 429) {
            return res.status(429).json({ message: 'TMDB rate limit', details: err.payload })
        }
        return res.status(500).json({ message: 'Error fetching trending from TMDB', details: err.payload || err.message })
    }
}
