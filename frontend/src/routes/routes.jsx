import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import ProtectedRoute from '../components/ProtectedRoute.jsx'


// Si exportan con nombre (p.ej. export const HomePage = ...):
const HomePage = lazy(() => import('../pages/HomePage').then(m => ({ default: m.HomePage })))
const SignInPage = lazy(() => import('../pages/SignInPage').then(m => ({ default: m.SignInPage })))
const MoviesPage = lazy(() => import('../pages/MoviesPage').then(m => ({ default: m.MoviesPage })))
const TvShowsPage = lazy(() => import('../pages/TvShowsPage').then(m => ({ default: m.TvShowsPage })))
const SignUpPage = lazy(() => import('../pages/SignUpPage').then(m => ({ default: m.SignUpPage })))
const ProfilePage = lazy(() => import('../pages/ProfilePage').then(m => ({ default: m.ProfilePage })))

export const AppRoutes = () => {
    return (
        <Suspense fallback={<div className="p-4 text-gray-200">Loading...</div>}>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route element={<ProtectedRoute />}>
                        <Route path="home" element={<HomePage />} />
                        <Route path="movies" element={<MoviesPage />} />
                        <Route path="tvshows" element={<TvShowsPage />} />
                        <Route path="profile" element={<ProfilePage />} />
                    </Route>
                </Route>

                {/* Ruta raíz como index */}
                <Route index element={<SignInPage />} />
                <Route path="signup" element={<SignUpPage />} />
            </Routes>
        </Suspense>
    )
}