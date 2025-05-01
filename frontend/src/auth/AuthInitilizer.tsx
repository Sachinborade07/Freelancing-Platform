import { useEffect } from 'react';
import { useAuthStore } from './store';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
    const { initialize, initialized } = useAuthStore();

    useEffect(() => {
        initialize();
    }, [initialize]);

    if (!initialized) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
}