import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../auth/store';

export function ProtectedRoute({ allowedRoles }: { allowedRoles: Array<'client' | 'freelancer'> }) {
    const { user, isAuthenticated, initialized } = useAuthStore();

    if (!initialized) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user && !allowedRoles.includes(user.user_type)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}