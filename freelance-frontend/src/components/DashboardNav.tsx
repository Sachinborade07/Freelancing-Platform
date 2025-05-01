import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { LayoutDashboard, Briefcase, Users, LogOut, HandCoins } from 'lucide-react';

export default function DashboardNav() {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const commonLinks = [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        // Messages link might depend on project context, consider placement
        // { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
    ];

    const clientLinks = [
        { href: '/dashboard/projects', label: 'My Projects', icon: Briefcase },
        { href: '/dashboard/projects/new', label: 'Post New Project', icon: Briefcase }, // Example additional link
    ];

    const freelancerLinks = [
        { href: '/dashboard/projects/find', label: 'Find Projects', icon: Briefcase },
        { href: '/dashboard/bids', label: 'My Bids', icon: HandCoins },
        { href: '/dashboard/profile', label: 'My Profile', icon: Users }, // Example additional link
    ];

    const links = user
        ? [
            ...commonLinks,
            ...(user.user_type === 'client' ? clientLinks : freelancerLinks),
        ]
        : commonLinks; // Show common links even if user briefly null during load?

    return (
        <aside className="w-64 flex-shrink-0 border-r border-border bg-card p-4 flex flex-col">
            <div className="mb-6">
                <Link href="/dashboard" className="flex items-center gap-2">
                    {/* Replace with a proper logo if available */}
                    <Briefcase className="h-6 w-6 text-primary" />
                    <span className="text-xl font-semibold text-foreground">ProManager</span>
                </Link>

            </div>
            <nav className="flex-1 space-y-2">
                {links.map((link) => (
                    <Button
                        key={link.href}
                        asChild
                        variant={pathname === link.href ? 'secondary' : 'ghost'}
                        className={cn(
                            "w-full justify-start gap-2",
                            pathname === link.href && "bg-accent text-accent-foreground"
                        )}
                    >
                        <Link href={link.href}>
                            <link.icon className="h-4 w-4" />
                            {link.label}
                        </Link>
                    </Button>
                ))}
            </nav>
            <div className="mt-auto">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={logout}
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>
        </aside>
    );
}
