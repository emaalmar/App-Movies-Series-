import { AppRoutes } from './routes/routes'
import { ProfileProvider } from './hooks/useProfile.jsx'

function App() {
  return (
    <ProfileProvider>
      <div className="">
        <AppRoutes />
      </div>
    </ProfileProvider>
  )
}

export default App
