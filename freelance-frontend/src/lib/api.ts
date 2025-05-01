import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'; // Use environment variable

interface RequestConfig extends AxiosRequestConfig {
    needsAuth?: boolean; // Flag to indicate if the request needs authentication
}

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add the auth token to requests that need it
apiClient.interceptors.request.use(
    (config) => {
        const requestConfig = config as RequestConfig;
        if (requestConfig.needsAuth) {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            } else {
                // Handle case where token is needed but not available
                // Could potentially cancel the request or redirect to login
                console.warn('Auth token requested but not found in localStorage.');
                // Example: Redirect to login
                // if (typeof window !== 'undefined') {
                //   window.location.href = '/login';
                // }
                // Or cancel the request:
                // return Promise.reject(new Error('Missing authentication token.'));
            }
        }
        // Remove the custom property before sending the request
        delete requestConfig.needsAuth;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Generic request function
async function request<T>(config: RequestConfig): Promise<AxiosResponse<T>> {
    try {
        const response = await apiClient.request<T>(config);
        return response;
    } catch (error) {
        // Handle errors (e.g., log, show notification)
        console.error('API call failed:', error);
        // Re-throw the error so calling components can handle it if needed
        throw error;
    }
}

// Specific methods using the generic request function

export const get = <T>(url: string, config: Omit<RequestConfig, 'method' | 'url'> = {}): Promise<AxiosResponse<T>> => {
    return request<T>({ ...config, method: 'GET', url });
};

export const post = <T>(url: string, data?: any, config: Omit<RequestConfig, 'method' | 'url' | 'data'> = {}): Promise<AxiosResponse<T>> => {
    return request<T>({ ...config, method: 'POST', url, data });
};

export const patch = <T>(url: string, data?: any, config: Omit<RequestConfig, 'method' | 'url' | 'data'> = {}): Promise<AxiosResponse<T>> => {
    return request<T>({ ...config, method: 'PATCH', url, data });
};

export const del = <T>(url: string, config: Omit<RequestConfig, 'method' | 'url'> = {}): Promise<AxiosResponse<T>> => {
    return request<T>({ ...config, method: 'DELETE', url });
};

export default apiClient;