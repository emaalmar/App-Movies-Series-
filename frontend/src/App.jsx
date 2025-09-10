<<<<<<< HEAD
import { AppRoutes } from './routes/routes';

function App() {
  
  return (
    <div className="">
      <AppRoutes />
    </div>
=======
import { AppRoutes } from './routes/routes'
import { ProfileProvider } from './hooks/useProfile.jsx'

function App() {
  return (
    <ProfileProvider>
      <div className="">
        <AppRoutes />
      </div>
    </ProfileProvider>
>>>>>>> entrega-inicial
  )
}

export default App
