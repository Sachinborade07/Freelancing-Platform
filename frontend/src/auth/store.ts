import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';

import { User } from '../types/user';
import { LoginData } from '../api/auth/login';
import { RegisterData } from '../api/auth/register';

const API_URL = 'http://localhost:3000';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    initialized: boolean;
    login: (data: LoginData) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            initialized: false,

            login: async (data) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await axios.post(`${API_URL}/auth/login`, data);
                    const { access_token, user } = response.data;

                    set({
                        user,
                        token: access_token,
                        isAuthenticated: true,
                        isLoading: false,
                        initialized: true,
                    });
                } catch (error: any) {
                    set({
                        error: error.response?.data?.message || 'Login failed',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            register: async (data) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await axios.post(`${API_URL}/auth/register`, data);
                    const { access_token, user } = response.data;

                    set({
                        user,
                        token: access_token,
                        isAuthenticated: true,
                        isLoading: false,
                        initialized: true,
                    });
                } catch (error: any) {
                    set({
                        error: error.response?.data?.message || 'Registration failed',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            logout: () => {
                // Clear all auth-related data from localStorage
                localStorage.removeItem('auth-storage');
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    initialized: true,
                });
            },

            initialize: async () => {
                // Skip if already initialized
                if (get().initialized) return;

                set({ isLoading: true });
                try {
                    // Check if we have persisted state
                    const persistedState = localStorage.getItem('auth-storage');
                    if (persistedState) {
                        const { state } = JSON.parse(persistedState);
                        if (state?.token) {
                            // Verify token with backend
                            try {
                                const response = await axios.get(`${API_URL}/users/me`, {
                                    headers: { Authorization: `Bearer ${state.token}` }
                                });

                                set({
                                    user: response.data,
                                    token: state.token,
                                    isAuthenticated: true,
                                    initialized: true,
                                    isLoading: false,
                                });
                                return;
                            } catch (error) {
                                console.log('Token validation failed, clearing storage');
                                localStorage.removeItem('auth-storage');
                            }
                        }
                    }

                    // No valid token found
                    set({
                        initialized: true,
                        isLoading: false,
                        isAuthenticated: false,
                        token: null,
                        user: null
                    });
                } catch (error) {
                    console.error('Initialization error:', error);
                    set({
                        initialized: true,
                        isLoading: false,
                        isAuthenticated: false,
                        token: null,
                        user: null
                    });
                }
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);