import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Skeleton } from '../components/ui/skeleton';

export default function Home() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (user) {
                router.replace('/dashboard');
            } else {
                router.replace('/login');
            }
        }
    }, [user, loading, router]);

    // Show a loading state while checking auth status
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Skeleton className="h-12 w-1/2" />
            </div>
        );
    }

    // This return is technically unreachable due to redirects,
    // but good practice to have a fallback.
    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Redirecting...</p>
        </div>
    );
}
