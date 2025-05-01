import React, { useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import Link from 'next/link';
import { Loader2 } from 'lucide-react'; // Loading spinner

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { login, user, loading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get('registered');


    // Redirect if already logged in
    React.useEffect(() => {
        if (!authLoading && user) {
            router.replace('/dashboard');
        }
    }, [user, authLoading, router]);


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null); // Clear previous errors
        setIsLoading(true);
        try {
            await login({ email, password });
            // Redirect is handled within the login function of AuthContext
        } catch (err) {
            setError('Invalid email or password. Please try again.');
            console.error("Login failed:", err);
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
                    <CardTitle className="text-2xl font-bold">ProManager Login</CardTitle>
                    <CardDescription>Enter your credentials to access your account.</CardDescription>
                </CardHeader>
                <CardContent>
                    {registered && (
                        <Alert variant="default" className="mb-4 bg-green-100 border-green-300 text-green-800">
                            <AlertTitle>Registration Successful!</AlertTitle>
                            <AlertDescription>
                                You can now log in with your new account.
                            </AlertDescription>
                        </Alert>
                    )}
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertTitle>Login Failed</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isLoading ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Don't have an account?{' '}
                        <Link href="/register" className="underline text-primary hover:text-primary/90">
                            Register here
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
