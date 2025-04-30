import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/User';
import api from '../api/auth';
import AuthContextType from '../types/AuthContextType';



const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    const userData = await api.getMe(storedToken);
                    setUser(userData);
                    setToken(storedToken);
                } catch (error) {
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const response = await api.login({ email, password });
        localStorage.setItem('token', response.access_token);
        setToken(response.access_token);
        setUser(response.user);
    };

    const register = async (data: {
        email: string;
        password: string;
        username: string;
        user_type: 'client' | 'freelancer';
    }) => {
        const response = await api.register(data);
        localStorage.setItem('token', response.access_token);
        setToken(response.access_token);
        setUser(response.user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                register,
                logout,
                isAuthenticated: !!user,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};