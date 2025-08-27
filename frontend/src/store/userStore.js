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