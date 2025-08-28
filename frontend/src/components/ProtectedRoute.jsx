import { Navigate, Outlet } from 'react-router-dom';
import { api } from '../services/api';
import { useState, useEffect } from 'react';

function ProtectedRoute({ children, redirectTo = '/' }) {
    const [auth, setAuth] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await api.get("/auth/profile"); // Usa una ruta protegida real
                setAuth(true);
            } catch (error) {
                setAuth(false);
            }
        };
        checkAuth();
    }, []);

    if (auth === null) {
        return <div>Verificando autenticación...</div>; // Loader temporal
    }

    if (!auth) {
        return <Navigate to={redirectTo} />;
    }

    return children ? children : <Outlet />;
}

export default ProtectedRoute;