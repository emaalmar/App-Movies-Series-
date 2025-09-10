import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import ProtectedRoute from '../components/ProtectedRoute.jsx'


<<<<<<< HEAD
// Si exportan con nombre (p.ej. export const Home = ...):
const Home = lazy(() => import('../pages/Home').then(m => ({ default: m.Home })))
const SignIn = lazy(() => import('../pages/SignIn').then(m => ({ default: m.SignIn })))
const Movies = lazy(() => import('../pages/Movies').then(m => ({ default: m.Movies })))
const TvShows = lazy(() => import('../pages/TvShows').then(m => ({ default: m.TvShows })))
const SignUp = lazy(() => import('../pages/SignUp').then(m => ({ default: m.SignUp })))

=======
// Si exportan con nombre (p.ej. export const HomePage = ...):
const HomePage = lazy(() => import('../pages/HomePage').then(m => ({ default: m.HomePage })))
const SignInPage = lazy(() => import('../pages/SignInPage').then(m => ({ default: m.SignInPage })))
const MoviesPage = lazy(() => import('../pages/MoviesPage').then(m => ({ default: m.MoviesPage })))
const TvShowsPage = lazy(() => import('../pages/TvShowsPage').then(m => ({ default: m.TvShowsPage })))
const SignUpPage = lazy(() => import('../pages/SignUpPage').then(m => ({ default: m.SignUpPage })))
const ProfilePage = lazy(() => import('../pages/ProfilePage').then(m => ({ default: m.ProfilePage })))
>>>>>>> entrega-inicial

export const AppRoutes = () => {
    return (
        <Suspense fallback={<div className="p-4 text-gray-200">Loading...</div>}>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route element={<ProtectedRoute />}>
<<<<<<< HEAD
                        <Route path="home" element={<Home />} />
                        <Route path="movies" element={<Movies />} />
                        <Route path="tvshows" element={<TvShows />} />
=======
                        <Route path="home" element={<HomePage />} />
                        <Route path="movies" element={<MoviesPage />} />
                        <Route path="tvshows" element={<TvShowsPage />} />
                        <Route path="profile" element={<ProfilePage />} />
>>>>>>> entrega-inicial
                    </Route>
                </Route>

                {/* Ruta raíz como index */}
<<<<<<< HEAD
                <Route index element={<SignIn />} />
                <Route path="signup" element={<SignUp />} />
=======
                <Route index element={<SignInPage />} />
                <Route path="signin" element={<SignInPage />} />
                <Route path="signup" element={<SignUpPage />} />
>>>>>>> entrega-inicial
            </Routes>
        </Suspense>
    )
}