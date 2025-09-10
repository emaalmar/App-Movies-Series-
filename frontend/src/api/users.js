import { api } from '../services/api'
import { profile as fetchProfile } from './auth'

// Simple in-memory cache for current user id to avoid repeated /auth/profile calls
let cachedUserId = null
export function clearCachedUserId() {
  cachedUserId = null
}

async function getCurrentUserId() {
  if (cachedUserId) return cachedUserId
  const res = await fetchProfile()
  const user = res.user || res.data?.user || res
  const id = user?._id || user?.id
  if (!id) throw new Error('Could not determine current user id')
  cachedUserId = id
  return id
}

export async function updateMe(data) {
  const id = await getCurrentUserId()
  const res = await api.put(`/users/${id}`, data)
  // update cache if server returns updated user
  if (res?.data?.user?._id) cachedUserId = res.data.user._id
  return res.data
}

export async function updatePassword(currentPassword, newPassword) {
  const id = await getCurrentUserId()
  const res = await api.put(`/users/${id}/password`, { currentPassword, newPassword })
  return res.data
}

export async function deleteMe() {
  const id = await getCurrentUserId()
  const res = await api.delete(`/users/${id}`)
  clearCachedUserId()
  return res.data
}
