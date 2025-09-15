import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const api = axios.create({
  baseURL: `${baseURL}/api`,
  headers: { 'Content-Type': 'application/json' },
  // withCredentials: true
})

// Request interceptor: add Authorization header from localStorage
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

// Response interceptor: on 401 clear token (NO redirect)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    if (status === 401) {
      try {
        localStorage.removeItem('token')
        // NO redirect, just clear token so frontend can handle error
      } catch {
        // noop
      }
    }
    return Promise.reject(error)
  }
)