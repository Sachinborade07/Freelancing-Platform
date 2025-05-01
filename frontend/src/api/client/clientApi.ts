import axios from 'axios';
import { useAuthStore } from '../../auth/store';

const API_URL = 'http://localhost:3000';

const api = axios.create({
    baseURL: API_URL,
});

// Request interceptor to inject token
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 error and not a login request
        if (error.response?.status === 401 && !originalRequest.url.includes('/auth/login')) {
            try {
                // Attempt to refresh token if you have refresh token logic
                // const newToken = await refreshToken();
                // if (newToken) {
                //   originalRequest.headers.Authorization = `Bearer ${newToken}`;
                //   return api(originalRequest);
                // }

                // If refresh fails, logout user
                useAuthStore.getState().logout();
                window.location.href = '/login';
            } catch (refreshError) {
                useAuthStore.getState().logout();
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;