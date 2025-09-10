import React, { useState, useEffect, useCallback } from 'react'
import { profile as fetchProfile } from '../api/auth'
import * as usersAPI from '../api/users'
import { useUserStore } from '../store/userStore'
import { ProfileContext } from './profileContext'

export const ProfileProvider = ({ children }) => {
  const token = useUserStore(state => state.token)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
  if (!token) return
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
  }, [token])

  useEffect(() => {
    if (token) {
      load()
    } else {
      setProfile(null)
      setError(null)
    }
  }, [token, load])

  const updateProfile = async (data) => {
    setLoading(true)
    try {
      const res = await usersAPI.updateMe(data)
      const user = res.user || res
      setProfile(user)
      return user
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

