import { api } from '../services/api'

export async function updateMe(data) {
  const res = await api.put('/users/me', data)
  return res.data
}

export async function updatePassword(currentPassword, newPassword) {
  const res = await api.put('/users/me/password', { currentPassword, newPassword })
  return res.data
}

export async function deleteMe() {
  const res = await api.delete('/users/me')
  return res.data
}
