import React, { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { RadioGroup, RadioGroupItem } from '@radix-ui/react-radio-group';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState<'client' | 'freelancer'>('client');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { register, user, loading: authLoading } = useAuth(); // Add user and authLoading
    const router = useRouter();

    // Redirect if already logged in
    React.useEffect(() => {
        if (!authLoading && user) {
            router.replace('/dashboard');
        }
    }, [user, authLoading, router]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        if (!username || !email || !password || !userType) {
            setError("Please fill in all fields.");
            setIsLoading(false);
            return;
        }

        try {
            await register({ username, email, password, user_type: userType });
            // Redirect is handled within the register function of AuthContext
        } catch (err: any) {
            // Basic error handling, refine based on actual API error responses
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Registration failed. Please try again.');
            }
            console.error("Registration failed:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Don't render the form if auth state is still loading or user is already logged in
    if (authLoading || (!authLoading && user)) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-md mx-4 shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Register for ProManager</CardTitle>
                    <CardDescription>Create your account to get started.</CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertTitle>Registration Failed</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Your Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="bg-secondary"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-secondary"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-secondary"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Account Type</Label>
                            <RadioGroup
                                defaultValue="client"
                                value={userType}
                                onValueChange={(value: 'client' | 'freelancer') => setUserType(value)}
                                className="flex space-x-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="client" id="r-client" />
                                    <Label htmlFor="r-client">Client</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="freelancer" id="r-freelancer" />
                                    <Label htmlFor="r-freelancer">Freelancer</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isLoading ? 'Registering...' : 'Register'}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{' '}
                        <Link href="/login" className="underline text-primary hover:text-primary/90">
                            Login here
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
