import { api } from '../services/api';

export const signinRequest = (user) => api.post('/auth/signin', user);
export const signupRequest = (user) => api.post('/auth/signup', user);
export const logoutRequest = () => api.post('/auth/logout');
export const profileRequest = () => api.get('/auth/profile');