import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { profile as fetchProfile } from '../api/auth'
import { api } from '../services/api'

export const ProfileContext = createContext(null)
export const useProfileContext = () => useContext(ProfileContext)

export const ProfileProvider = ({ children }) => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Cargar perfil cuando cambia el usuario autenticado
  useEffect(() => {
    if (!user) {
      setProfile(null)
      return
    }
    setLoading(true)
    fetchProfile()
      .then((res) => setProfile(res.user || res))
      .catch((err) => setError(err?.message || 'Error al cargar perfil'))
      .finally(() => setLoading(false))
  }, [user])

  const updateProfile = async (updates) => {
    setLoading(true)
    setError('')
    try {
      // PUT /users/:id
      const updated = await api.put(`/users/${user?._id || user?.id}`, updates)
      setProfile(updated.data.user || updated.data)
      return updated.data
    } catch (err) {
      setError(err?.message || 'Error al actualizar perfil')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async (currentPassword, newPassword) => {
    setLoading(true)
    setError('')
    try {
      // PUT /users/:id/password
      await api.put(`/users/${user?._id || user?.id}/password`, { currentPassword, newPassword })
    } catch (err) {
      setError(err?.message || 'Error al cambiar contraseña')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProfileContext.Provider value={{ profile, loading, error, updateProfile, changePassword }}>
      {children}
    </ProfileContext.Provider>
  )
}
