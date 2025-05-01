import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../auth/store';
import { useEffect } from 'react';

export function Layout() {
    const { initialize, initialized } = useAuthStore();

    useEffect(() => {
        initialize();
    }, [initialize]);

    if (!initialized) {
        return <div>Loading...</div>;
    }

    return <Outlet />;
}