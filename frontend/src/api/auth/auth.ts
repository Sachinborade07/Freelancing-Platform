import axios from 'axios';
import { LoginData } from './login';
import { RegisterData } from './register';
import { User } from '../../types/user';


const API_URL = 'http://localhost:3000';

const api = axios.create({
    baseURL: API_URL,
});

export default {
    login: async (data: LoginData): Promise<{ access_token: string; user: User }> => {
        const response = await api.post<{ access_token: string; user: User }>('/auth/login', data);
        return response.data;
    },

    register: async (data: RegisterData): Promise<{ access_token: string; user: User }> => {
        const response = await api.post<{ access_token: string; user: User }>('/auth/register', data);
        return response.data;
    },

    getMe: async (token: string): Promise<User> => {
        const response = await api.get<User>('/users/me', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

};