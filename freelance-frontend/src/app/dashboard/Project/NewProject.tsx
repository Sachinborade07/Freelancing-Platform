import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/text-area';
import { Label } from '../../../components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '../../../components/ui/alert';
import { useRouter } from 'next/navigation';
import { post } from '../../../lib/api';
import { Loader2, PlusCircle } from 'lucide-react';

export default function NewProjectPage() {
    const { user, token } = useAuth();
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState('');
    const [deadline, setDeadline] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Ensure page is only accessible to clients
    if (user && user.user_type !== 'client') {
        return (
            <Alert variant="destructive">
                <AlertTitle>Access Denied</AlertTitle>
                <AlertDescription>Only clients can post new projects.</AlertDescription>
            </Alert>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description || !budget || !user || !token) {
            setError("Please fill in Title, Description, and Budget.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const projectData = {
                title,
                description,
                budget: budget, // Ensure budget is sent in the correct format expected by API (string or number)
                deadline: deadline || null, // Send null if empty
                client_id: user.user_id, // Assuming API needs client_id, adjust if it gets from token
                status: 'open' // Default status for new projects
            };

            // Adjust endpoint '/projects' if needed
            const response = await post<any>('/projects', projectData, { needsAuth: true });

            setSuccess(`Project "${response.data.title}" created successfully! Redirecting...`);
            // Clear form
            setTitle('');
            setDescription('');
            setBudget('');
            setDeadline('');

            // Redirect to the new project page or the projects list after a short delay
            setTimeout(() => {
                router.push('/dashboard/projects'); // Or `/dashboard/projects/${response.data.project_id}`
            }, 2000);

        } catch (err: any) {
            console.error("Failed to create project:", err);
            setError(err.response?.data?.message || "Failed to create project. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold flex items-center gap-2">
                <PlusCircle className="h-7 w-7" /> Post a New Project
            </h1>

            <Card>
                <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                    <CardDescription>Fill in the details below to post your project and attract freelancers.</CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {success && (
                        <Alert variant="default" className="mb-4 bg-green-100 border-green-300 text-green-800">
                            <AlertTitle>Success!</AlertTitle>
                            <AlertDescription>{success}</AlertDescription>
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Project Title <span className="text-destructive">*</span></Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., E-commerce Website Development"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe your project requirements in detail..."
                                required
                                rows={6}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="budget">Budget ($) <span className="text-destructive">*</span></Label>
                                <Input
                                    id="budget"
                                    type="number"
                                    min="0"
                                    step="0.01" // For currency
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    placeholder="e.g., 1500.00"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="deadline">Deadline (Optional)</Label>
                                <Input
                                    id="deadline"
                                    type="date"
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]} // Prevent past dates
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? 'Posting Project...' : 'Post Project'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

NewProjectPage.requiredRole = 'client';
