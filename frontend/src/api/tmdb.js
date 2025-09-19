import { api } from '../services/api'

export async function discoverMovie (params) {
  const res = await api.get('/tmdb/discover/movie', { params })
  return res.data
}

export async function discoverTv (params) {
  const res = await api.get('/tmdb/discover/tv', { params })
  return res.data
}

export async function trending (media = 'movie', period = 'day') {
  const res = await api.get(`/tmdb/trending/${media}/${period}`)
  return res.data
}
