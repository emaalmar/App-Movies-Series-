import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { profile as fetchProfile } from '../api/auth'
import * as usersAPI from '../api/users'

const ProfileContext = createContext(null)

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetchProfile()
      const user = res.user || res.data?.user || res
      setProfile(user)
      return user
    } catch (err) {
      setError(err?.response?.data?.message || err?.message)
      setProfile(null)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const updateProfile = async (data) => {
    setLoading(true)
    const res = await usersAPI.updateMe(data)
    const user = res.user || res
    setProfile(user)
    setLoading(false)
    return user
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

export const useProfile = () => {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider')
  return ctx
}
