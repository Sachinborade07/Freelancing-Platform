import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function DashboardPage() {
    const { user } = useAuth();

    if (!user) {
        // Optional: Show loading or redirect if user data isn't available yet
        // This should ideally be handled by ProtectedRoute, but as a fallback:
        return <div>Loading user data...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Welcome back, {user.username}!</h1>
            <p className="text-muted-foreground">Here's a quick overview of your ProManager dashboard.</p>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Client Specific Cards */}
                {user.user_type === 'client' && (
                    <>
                        <Card>
                            <CardHeader>
                                <CardTitle>My Projects</CardTitle>
                                <CardDescription>View and manage projects you've posted.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* Add some dynamic data here later, e.g., project count */}
                                <Button asChild variant="outline">
                                    <Link href="/dashboard/projects">
                                        View Projects <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                        <Card className="bg-primary/10 border-primary">
                            <CardHeader>
                                <CardTitle>Post a New Project</CardTitle>
                                <CardDescription>Ready to start something new? Post your requirements.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button asChild>
                                    <Link href="/dashboard/projects/new">
                                        Post Project <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </>
                )}

                {/* Freelancer Specific Cards */}
                {user.user_type === 'freelancer' && (
                    <>
                        <Card>
                            <CardHeader>
                                <CardTitle>Find Projects</CardTitle>
                                <CardDescription>Browse available projects and submit your bids.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button asChild variant="outline">
                                    <Link href="/dashboard/projects/find">
                                        Browse Projects <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>My Bids</CardTitle>
                                <CardDescription>Track the status of bids you've submitted.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* Add dynamic data e.g., active bids count */}
                                <Button asChild variant="outline">
                                    <Link href="/dashboard/bids">
                                        View My Bids <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>My Profile</CardTitle>
                                <CardDescription>Update your skills, bio, and hourly rate.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button asChild variant="outline">
                                    <Link href="/dashboard/profile">
                                        Update Profile <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </>
                )}

                {/* Common Card (Example) */}
                {/* <Card>
            <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>Check your latest conversations.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Button asChild variant="outline" disabled> // Disable if project context needed
                  <Link href="/dashboard/messages">
                    View Messages <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
            </CardContent>
        </Card> */}

            </div>
        </div>
    );
}
