<<<<<<< HEAD
import { create } from 'zustand';

export const useUserStore = create((set) => ({
    token: localStorage.getItem('token') || null,
    setToken: (token) => {
        if (token) {
            localStorage.setItem('token', token);
            set({ token });
        } else {
            localStorage.removeItem('token');
            set({ token: null });
        }
    },
    logout: () => {
        localStorage.removeItem('token');
        set({ token: null });
    },
}));
=======
import { create } from 'zustand'
import * as authAPI from '../api/auth'

export const useUserStore = create((set) => ({
    token: localStorage.getItem('token') || null,

    setToken: (token) => {
        if (token) {
            localStorage.setItem('token', token)
            set({ token })
        } else {
            localStorage.removeItem('token')
            set({ token: null })
        }
    },

    logout: async () => {
        const token = localStorage.getItem('token')
        if (!token) return
        try {
            await authAPI.logout(token)
        } catch (err) {
            // If logout request fails, still clear client state to avoid stuck sessions
            console.error('Logout failed:', err?.response?.data || err.message)
        }
        localStorage.removeItem('token')
        set({ token: null })
    }
}))
>>>>>>> entrega-inicial
