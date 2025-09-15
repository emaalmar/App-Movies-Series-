import axios from 'axios'

const baseURL = (import.meta.env.VITE_API_URL || 'https://app-movies-series.vercel.app').replace(/\/+$/, '')

export const api = axios.create({
  baseURL: `${baseURL}/api`,
  headers: { 'Content-Type': 'application/json' },
  // withCredentials: true
})

api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers = config.headers || {}
        config.headers['Authorization'] = `Bearer ${token}`
      }
    } catch {
      // ignore when running in non-browser env
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    if (status === 401) {
      try {
        localStorage.removeItem('token')
      } catch {
        // noop
      }
    }
    return Promise.reject(error)
  }
)
