import { useAuth } from '../../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../../../components/ui/alert';
import { User } from 'lucide-react';

export default function FreelancerProfilePage() {
    const { user } = useAuth();

    // Ensure page is only accessible to freelancers if required by business logic
    if (user && user.user_type !== 'freelancer') {
        return (
            <Alert variant="destructive">
                <AlertTitle>Access Denied</AlertTitle>
                <AlertDescription>This page is only accessible to freelancers.</AlertDescription>
            </Alert>
        );
    }


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold flex items-center gap-2">
                <User className="h-7 w-7" /> My Profile
            </h1>

            <Card>
                <CardHeader>
                    <CardTitle>Profile Management</CardTitle>
                    <CardDescription>Update your freelancer profile details here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Profile editing features (bio, skills, experience, hourly rate) are not yet implemented.
                        This section will allow you to manage how clients see your profile.
                    </p>
                    {/* Placeholder for future form */}
                    <div className="mt-6 border rounded-lg p-6 bg-secondary/30">
                        <h3 className="font-semibold mb-2">Coming Soon:</h3>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                            <li>Edit Bio and Experience</li>
                            <li>Manage Skills and Proficiency</li>
                            <li>Set Hourly Rate</li>
                            <li>Upload Portfolio Items</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}

FreelancerProfilePage.requiredRole = 'freelancer';
