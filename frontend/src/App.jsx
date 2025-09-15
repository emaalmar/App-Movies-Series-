import { AuthProvider } from './contexts/AuthContext.jsx'
import { AppRoutes } from './routes/routes'
import { ProfileProvider } from './contexts/ProfileContext'

function App () {
  return (
    <AuthProvider>
      <ProfileProvider>
        <div className=''>
          <AppRoutes />
        </div>
      </ProfileProvider>
    </AuthProvider>
  )
}

export default App
