import { createContext, useContext, useEffect, useState } from "react";
import { profile, logout as apiLogout } from "../api/auth";

//Creacion del Contexto
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext)
//Creacion del Provider

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }
            try {
                const res = await profile();
                setUser(res);
            } catch (error) {
                setUser(null);
                localStorage.removeItem('token');
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        checkProfile();
    }, []);

    const logout = async () => {
        try {
            await apiLogout();
        } catch (e) {
            // Si falla, igual limpiamos el estado local
            console.error('Logout failed:', e?.response?.data || e.message);
        }
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}