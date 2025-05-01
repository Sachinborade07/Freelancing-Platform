import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { get } from '../../../lib/api';
import type { Bid } from '../../../types/bid';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Skeleton } from '../../../components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../../../components/ui/alert';
import { format } from 'date-fns';
import { HandCoins, ArrowRight } from 'lucide-react';

export default function FreelancerBidsPage() {
    const { user, token } = useAuth();
    const [bids, setBids] = useState<Bid[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBids = async () => {
            if (!user || user.user_type !== 'freelancer' || !token) {
                setError("Unauthorized or user data not available.");
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                // Assuming API returns bids for the logged-in freelancer
                // Adjust endpoint if needed, e.g., '/freelancers/me/bids' or '/bids?freelancerId=...'
                const response = await get<Bid[]>('/bids', { needsAuth: true });
                // Ensure nested project data is included or fetch separately if needed
                setBids(response.data);
            } catch (err) {
                console.error("Failed to fetch bids:", err);
                setError("Could not load your bids. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchBids();
    }, [user, token]);

    const getStatusBadgeVariant = (status: Bid['status']): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
            case 'accepted': return 'default'; // Use primary color
            case 'submitted': return 'secondary';
            case 'rejected':
            case 'withdrawn': return 'destructive';
            default: return 'outline';
        }
    }

    const formatStatus = (status: string): string => {
        return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <HandCoins className="h-7 w-7" /> My Submitted Bids
                </h1>
                <Button asChild variant="outline">
                    <Link href="/dashboard/projects/find">
                        Find More Projects <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>


            {error && (
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Your Bids</CardTitle>
                    <CardDescription>Track the status of all bids you have submitted.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ) : bids.length === 0 && !error ? (
                        <div className="text-center py-10">
                            <p className="text-muted-foreground">You haven't submitted any bids yet.</p>
                            <Button asChild className="mt-4">
                                <Link href="/dashboard/projects/find">
                                    Find Projects to Bid On
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Project Title</TableHead>
                                    <TableHead>Your Bid Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Submitted On</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bids.map((bid) => (
                                    <TableRow key={bid.bid_id}>
                                        <TableCell className="font-medium">
                                            {/* Link to the project details page */}
                                            <Link href={`/dashboard/projects/${bid.project_id}`} className="hover:underline text-primary">
                                                {bid.project?.title ?? 'Project Title Unavailable'}
                                            </Link>
                                        </TableCell>
                                        <TableCell>${bid.bid_amount}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(bid.status)}>
                                                {formatStatus(bid.status)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{format(new Date(bid.submitted_at), 'PPpp')}</TableCell>
                                        <TableCell>
                                            <Button asChild variant="link" size="sm">
                                                {/* Link to view bid details or the project */}
                                                <Link href={`/dashboard/projects/${bid.project_id}`}>
                                                    View Project
                                                </Link>
                                            </Button>
                                            {/* Add withdraw button if status allows */}
                                            {/* {bid.status === 'submitted' && (
                        <Button variant="destructive" size="sm" className="ml-2">Withdraw</Button>
                       )} */}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
                {!loading && bids.length > 0 && (
                    <CardFooter className="text-sm text-muted-foreground">
                        Showing {bids.length} bid(s).
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}

// Ensure accessible only to freelancers via ProtectedRoute or specific check
FreelancerBidsPage.requiredRole = 'freelancer';
