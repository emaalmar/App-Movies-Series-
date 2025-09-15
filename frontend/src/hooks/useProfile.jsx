import React, { useState, useEffect, useCallback } from 'react'
import { ProfileContext } from '../contexts/ProfileContext'
import { profile as fetchProfile } from '../api/auth'
import * as usersAPI from '../api/users'
import { useAuth } from '../contexts/AuthContext'

export const ProfileProvider = ({ children }) => {
  const { user, setUser } = useAuth()
  const [profile, setProfile] = useState(user)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Si el usuario cambia en AuthContext, actualiza el perfil local
  useEffect(() => {
    setProfile(user)
  }, [user])

  // Lógica avanzada: recargar perfil desde backend si se requiere
  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetchProfile()
      const userData = res.user || res.data?.user || res
      setProfile(userData)
      setUser && setUser(userData) // Actualiza AuthContext si es necesario
      return userData
    } catch (err) {
      setError(err?.response?.data?.message || err?.message)
      setProfile(null)
      setUser && setUser(null)
      throw err
    } finally {
      setLoading(false)
    }
  }, [setUser])

  const updateProfile = async (data) => {
    setLoading(true)
    try {
      const res = await usersAPI.updateMe(data)
      const userData = res.user || res
      setProfile(userData)
      setUser && setUser(userData)
      return userData
    } finally {
      setLoading(false)
    }
  }

  const updatePassword = async (currentPassword, newPassword) => {
    setLoading(true)
    const res = await usersAPI.updatePassword(currentPassword, newPassword)
    setLoading(false)
    return res
  }

  const clearProfile = () => setProfile(null)

  return (
    <ProfileContext.Provider value={{ profile, loading, error, load, updateProfile, updatePassword, clearProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

