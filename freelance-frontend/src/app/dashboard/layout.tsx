import { type ReactNode } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import DashboardNav from '../../components/DashboardNav';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-background">
                <DashboardNav /> {/* Sidebar/Navigation */}
                <main className="flex-1 p-6 lg:p-8">
                    {/* Add a container for better content structure and potential styling */}
                    <div className="container mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
