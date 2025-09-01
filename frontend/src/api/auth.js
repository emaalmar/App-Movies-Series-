import { api } from '../services/api'

export async function signup(data) {
  const res = await api.post('/auth/signup', data)
  return res.data
}

export async function signin(data) {
  const res = await api.post('/auth/signin', data)
  return res.data
}

export async function logout() {
  // Authorization header is attached by interceptor
  const res = await api.post('/auth/logout')
  return res.data
}

export async function profile() {
  const res = await api.get('/auth/profile')
  return res.data
}
