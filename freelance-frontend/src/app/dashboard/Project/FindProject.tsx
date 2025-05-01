import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { get } from '../../../lib/api';
import type { Project, ProjectsApiResponse } from '../../../types/Project';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Skeleton } from '../../../components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../../../components/ui/alert';
import { format } from 'date-fns';
import { Briefcase, Search, ArrowRight, Calendar, DollarSign } from 'lucide-react';


export default function FindProjectsPage() {
    const { user, token } = useAuth(); // Check user type if needed
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    // Add state for pagination if API supports it
    // const [page, setPage] = useState(1);
    // const [totalCount, setTotalCount] = useState(0);

    // Debounce search term
    useEffect(() => {
        const handler = setTimeout(() => {
            fetchProjects(); // Fetch with the debounced search term
        }, 500); // 500ms delay

        return () => {
            clearTimeout(handler); // Cleanup timer on component unmount or search term change
        };
    }, [searchTerm, token]); // Re-run fetch when searchTerm or token changes


    const fetchProjects = async () => {
        if (!token) {
            // No need to fetch if not authenticated (though ProtectedRoute should handle this)
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            // Adjust API endpoint and query parameters as needed
            // Example: support for search and pagination
            const params: Record<string, string> = { status: 'open' }; // Only show open projects
            if (searchTerm) {
                params.search = searchTerm;
            }
            // if (page > 1) {
            //     params.page = page.toString();
            // }
            // params.limit = '10'; // Example limit

            const response = await get<ProjectsApiResponse>('/projects', { // Use '/projects' or the specific endpoint for browsing
                params: params,
                needsAuth: true // Might not need auth to *browse* projects, adjust if needed
            });
            setProjects(response.data.data); // Adjust if API response structure is different
            // setTotalCount(response.data.count); // Assuming API returns count
        } catch (err) {
            console.error("Failed to fetch projects:", err);
            setError("Could not load available projects. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch on mount is handled by the useEffect watching searchTerm (initially empty)

    const getStatusBadgeVariant = (status: Project['status']): "default" | "secondary" | "destructive" | "outline" => {
        // Simplified for browsing (mostly 'open')
        if (status === 'open') return 'outline';
        return 'secondary'; // Fallback
    }

    const formatStatus = (status: string): string => {
        return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }


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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Briefcase className="h-7 w-7" /> Find Projects
                </h1>
                <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search projects (e.g., 'React', 'Design')..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {loading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            ) : projects.length === 0 && !error ? (
                <Card className="text-center py-10">
                    <CardContent>
                        <p className="text-muted-foreground">
                            {searchTerm ? `No projects found matching "${searchTerm}".` : "No open projects available right now."}
                        </p>
                        {searchTerm && <Button variant="link" onClick={() => setSearchTerm('')}>Clear Search</Button>}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <Card key={project.project_id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-xl mb-1">{project.title}</CardTitle>
                                    <Badge variant={getStatusBadgeVariant(project.status)}>
                                        {formatStatus(project.status)}
                                    </Badge>
                                </div>
                                <CardDescription className="line-clamp-3 h-[60px] overflow-hidden"> {/* Limit description length */}
                                    {project.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <DollarSign className="h-4 w-4" />
                                    Budget: ${project.budget}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    Posted: {format(new Date(project.created_at), 'PP')}
                                </div>
                                {project.deadline && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        Deadline: {format(new Date(project.deadline), 'PP')}
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full">
                                    <Link href={`/dashboard/projects/${project.project_id}`}>
                                        View Details & Bid <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
            {/* Add Pagination controls here if implemented */}
            {/* {!loading && totalCount > projects.length && (
           <div className="flex justify-center mt-6">
             <Button onClick={() => setPage(p => p - 1)} disabled={page === 1}>Previous</Button>
             <span className="mx-4 self-center text-muted-foreground">Page {page}</span>
             <Button onClick={() => setPage(p => p + 1)} disabled={projects.length < 10}>Next</Button> // Adjust limit
           </div>
       )} */}
        </div>
    );
}

// Mark as freelancer-only if needed for clarity or extra checks
FindProjectsPage.requiredRole = 'freelancer';
