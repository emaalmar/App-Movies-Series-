import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import ProtectedRoute from '../components/ProtectedRoute.jsx'


// Si exportan con nombre (p.ej. export const Home = ...):
const Home = lazy(() => import('../pages/Home').then(m => ({ default: m.Home })))
const SignIn = lazy(() => import('../pages/SignIn').then(m => ({ default: m.SignIn })))
const Movies = lazy(() => import('../pages/Movies').then(m => ({ default: m.Movies })))
const TvShows = lazy(() => import('../pages/TvShows').then(m => ({ default: m.TvShows })))
const SignUp = lazy(() => import('../pages/SignUp').then(m => ({ default: m.SignUp })))


export const AppRoutes = () => {
    return (
        <Suspense fallback={<div className="p-4 text-gray-200">Loading...</div>}>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route element={<ProtectedRoute />}>
                        <Route path="home" element={<Home />} />
                        <Route path="movies" element={<Movies />} />
                        <Route path="tvshows" element={<TvShows />} />
                    </Route>
                </Route>

                {/* Ruta raíz como index */}
                <Route index element={<SignIn />} />
                <Route path="signup" element={<SignUp />} />
            </Routes>
        </Suspense>
    )
}