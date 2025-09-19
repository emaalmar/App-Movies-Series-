import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function ProtectedRoute ({ children, redirectTo = '/' }) {
  const { user, loading } = useAuth()

  if (loading) return null // o un spinner si prefieres

  const isAuthenticated = !!user

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} />
  }

  return children || <Outlet />
}

export default ProtectedRoute
