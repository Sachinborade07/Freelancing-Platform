import { createContext, useState, useContext, useEffect, type ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { post } from '../lib/api';
import { User } from '../types/User';

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (credentials: { email: string; password: string }) => Promise<void>;
    register: (userData: { username: string, email: string; password: string, user_type: 'client' | 'freelancer' }) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true); // Start loading until initial check is done
    const router = useRouter();

    // Function to load user and token from localStorage
    const loadAuthData = useCallback(() => {
        setLoading(true);
        try {
            const storedToken = localStorage.getItem('accessToken');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            } else {
                setToken(null);
                setUser(null);
            }
        } catch (error) {
            console.error("Failed to load auth data from local storage:", error);
            // Clear potentially corrupted data
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []); // Empty dependency array, runs once on mount conceptually


    // Load auth data on initial mount
    useEffect(() => {
        loadAuthData();
        // Add event listener for storage changes to sync across tabs
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'accessToken' || event.key === 'user') {
                loadAuthData(); // Reload data if relevant items change
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [loadAuthData]); // Depend on loadAuthData


    const login = async (credentials: { email: string; password: string }) => {
        setLoading(true);
        try {
            const response = await post<{ access_token: string; user: User }>('/auth/login', credentials);
            const { access_token, user: loggedInUser } = response.data;

            localStorage.setItem('accessToken', access_token);
            localStorage.setItem('user', JSON.stringify(loggedInUser));
            setToken(access_token);
            setUser(loggedInUser);
            router.push('/dashboard'); // Redirect after successful login
        } catch (error) {
            console.error('Login failed:', error);
            // Handle login error (e.g., show error message to user)
            throw error; // Re-throw to allow component-level handling
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData: { username: string, email: string; password: string, user_type: 'client' | 'freelancer' }) => {
        setLoading(true);
        try {
            // Assuming the register endpoint doesn't automatically log the user in
            await post('/auth/register', userData);
            // Optionally redirect to login page or show success message
            router.push('/login?registered=true'); // Redirect to login after successful registration
        } catch (error) {
            console.error('Registration failed:', error);
            throw error; // Re-throw
        } finally {
            setLoading(false);
        }
    };


    const logout = useCallback(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        router.push('/login'); // Redirect to login page after logout
    }, [router]);

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};