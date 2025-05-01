import { useEffect } from 'react';
import { useAuthStore } from './store';
import { useNavigate } from 'react-router-dom';

export const useAuthRedirect = (redirectPath: string, requireAuth = false) => {
    const { isAuthenticated, loading } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {

        if (!loading) {
            if (requireAuth && !isAuthenticated) {
                navigate(redirectPath);
            } else if (!requireAuth && isAuthenticated) {
                navigate(redirectPath);
            }
        }
    }, [isAuthenticated, loading, navigate, redirectPath, requireAuth]);

    return { isAuthenticated, loading };
};

export const useCurrentUser = () => {
    return useAuthStore((state) => state.user);
};