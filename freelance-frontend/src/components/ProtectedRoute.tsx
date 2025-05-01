import React, { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Skeleton } from './ui/skeleton';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: ('client' | 'freelancer')[]; // Optional: Specify allowed roles
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { user, loading, token } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Wait until loading is false before checking authentication
        if (!loading) {
            const isAuthenticated = !!user && !!token;

            if (!isAuthenticated) {
                // Redirect to login if not authenticated
                router.replace('/login');
            } else if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.user_type)) {
                // Redirect to an unauthorized page or dashboard if role is not allowed
                console.warn(`User type "${user.user_type}" not allowed for this route.`);
                router.replace('/dashboard'); // Or a dedicated '/unauthorized' page
            }
            // If authenticated and role is allowed (or no specific role required), allow access
        }
    }, [user, loading, token, router, allowedRoles]);

    // Show loading indicator while checking auth state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                {/* You can use a more specific loading indicator for protected routes */}
                <Skeleton className="h-screen w-full" />
            </div>
        );
    }

    // Render children only if authenticated and authorized (or if loading is finished and checks passed)
    return (user && token && (!allowedRoles || allowedRoles.includes(user.user_type))) ? <>{children}</> : null;
};

export default ProtectedRoute;
