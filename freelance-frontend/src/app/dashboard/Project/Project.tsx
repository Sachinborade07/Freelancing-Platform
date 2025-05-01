import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { get, post } from '../../../lib/api';
import type { Project } from '../../../types/Project';
import type { Milestone } from '../../../types/milestone';
import type { Bid } from '../../../types/bid';
import type { Message } from '../../../types/message';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Textarea } from '../../../components/ui/text-area';
import { Skeleton } from '../../../components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../../../components/ui/alert';
import { format } from 'date-fns';
import { Calendar, DollarSign, Clock, User, MessageSquare, Send, HandCoins } from 'lucide-react';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { subscribeToMessages } from '../../../services/messages';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { cn } from '../../../lib/utils';



export default function ProjectDetailsPage() {
    const { user, token } = useAuth();
    const params = useParams();
    const projectId = parseInt(params.projectId as string, 10);

    const [project, setProject] = useState<Project | null>(null);
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [bids, setBids] = useState<Bid[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessageContent, setNewMessageContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSending, setIsSending] = useState(false);

    const messageListRef = useRef<HTMLDivElement>(null);

    const fetchData = useCallback(async () => {
        if (!projectId || isNaN(projectId) || !token) {
            setError("Invalid project ID or not authenticated.");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const projectResponse = await get<Project>(`/projects/${projectId}`, { needsAuth: true });
            setProject(projectResponse.data);

            const milestonesResponse = await get<Milestone[]>(`/milestones?projectId=${projectId}`, { needsAuth: true });
            setMilestones(milestonesResponse.data);

            const messagesResponse = await get<Message[]>(`/messages?projectId=${projectId}`, { needsAuth: true });
            setMessages(messagesResponse.data.sort((a, b) => new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime()));

            if (user?.user_type === 'client' && projectResponse.data.client_id === user.user_id) {
                const bidsResponse = await get<Bid[]>(`/bids?projectId=${projectId}`, { needsAuth: true });
                setBids(bidsResponse.data);
            }

        } catch (err) {
            console.error("Failed to fetch project details:", err);
            setError("Could not load project details. Please try again later.");
            setProject(null);
        } finally {
            setLoading(false);
        }
    }, [projectId, token, user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (!projectId || isNaN(projectId)) return;

        const eventSource = subscribeToMessages(
            projectId,
            (newMessage) => {
                setMessages((prevMessages) => {
                    if (prevMessages.some(msg => msg.message_id === newMessage.message_id)) {
                        return prevMessages;
                    }
                    const updatedMessages = [...prevMessages, newMessage];
                    return updatedMessages.sort((a, b) => new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime());
                });
                setTimeout(() => messageListRef.current?.scrollTo({ top: messageListRef.current.scrollHeight, behavior: 'smooth' }), 100);
            },
            (error) => {
                console.error("SSE Error:", error);
                setError(prev => prev ? `${prev}\nMessage connection error.` : "Message connection error.");
            }
        );

        return () => {
            eventSource.close();
        };
    }, [projectId]);

    useEffect(() => {
        if (!loading && messages.length > 0) {
            messageListRef.current?.scrollTo({ top: messageListRef.current.scrollHeight });
        }
    }, [loading, messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessageContent.trim() || !project || !user) return;

        setIsSending(true);
        setError(null);

        let receiverId: number | undefined;
        if (user.user_type === 'client') {
            const acceptedBid = bids.find(bid => bid.status === 'accepted');
            receiverId = acceptedBid?.freelancer?.user_id;
            if (!receiverId) {
                console.warn("Cannot determine receiver: No accepted bid found.");
                setError("Cannot send message: No freelancer assigned or accepted.");
                setIsSending(false);
                return;
            }
        } else {
            receiverId = project.client?.user_id;
        }

        if (!receiverId) {
            setError("Could not determine the recipient for the message.");
            setIsSending(false);
            return;
        }

        try {
            await post<Message>('/messages', {
                project_id: projectId,
                sender_id: user.user_id,
                receiver_id: receiverId,
                content: newMessageContent,
            }, { needsAuth: true });

            setNewMessageContent('');
            setTimeout(() => messageListRef.current?.scrollTo({ top: messageListRef.current.scrollHeight, behavior: 'smooth' }), 100);

        } catch (err) {
            console.error("Failed to send message:", err);
            setError("Failed to send message. Please try again.");
        } finally {
            setIsSending(false);
        }
    };

    const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
        const lowerStatus = status.toLowerCase();
        if (lowerStatus.includes('complete')) return 'default';
        if (lowerStatus.includes('progress') || lowerStatus.includes('submitted')) return 'secondary';
        if (lowerStatus.includes('open') || lowerStatus.includes('pending')) return 'outline';
        if (lowerStatus.includes('cancel') || lowerStatus.includes('reject') || lowerStatus.includes('overdue') || lowerStatus.includes('withdrawn')) return 'destructive';
        return 'outline';
    };

    const formatStatus = (status: string): string => {
        return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <div className="grid gap-6 md:grid-cols-3">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
                <Button variant="link" onClick={fetchData} className="mt-2">Retry</Button>
            </Alert>
        );
    }

    if (!project) {
        return <Alert>Project not found.</Alert>;
    }

    const isClientOwner = user?.user_type === 'client' && project.client_id === user.user_id;
    const isBiddingFreelancer = user?.user_type === 'freelancer' && bids.some(bid => bid.freelancer_id === user.user_id);


    return (
        <div className="space-y-8">
            {/* Project Header */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-3xl font-bold mb-2">{project.title}</CardTitle>
                            <CardDescription className="flex items-center gap-2 text-base">
                                <User className="h-4 w-4" /> Client: {project.client?.company_name ?? project.client?.user.username ?? 'N/A'}
                            </CardDescription>
                        </div>
                        <Badge variant={getStatusBadgeVariant(project.status)} className="text-lg px-4 py-1">
                            {formatStatus(project.status)}
                        </Badge>
                    </div>

                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{project.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-primary" />
                            <strong>Budget:</strong> ${project.budget}
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <strong>Created:</strong> {format(new Date(project.created_at), 'PP')}
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <strong>Deadline:</strong> {project.deadline ? format(new Date(project.deadline), 'PP') : 'N/A'}
                        </div>
                        {/* Add Assigned Freelancer if available */}
                        {/* {project.assigned_freelancer && (
                 <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-green-600" />
                    <strong>Assigned:</strong> {project.assigned_freelancer.user.username}
                 </div>
             )} */}
                    </div>
                </CardContent>
                {/* Add Action buttons (e.g., Edit for client, Place Bid for freelancer) */}
                {/* <CardFooter>
             {isClientOwner && <Button>Edit Project</Button>}
             {user?.user_type === 'freelancer' && project.status === 'open' && !isBiddingFreelancer && (
                 <Button>Place Bid</Button>
             )}
         </CardFooter> */}
            </Card>

            {/* Bids Section (Client View) */}
            {isClientOwner && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><HandCoins /> Bids Received</CardTitle>
                        <CardDescription>Review bids submitted by freelancers for this project.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {bids.length === 0 ? (
                            <p className="text-muted-foreground">No bids received yet.</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Freelancer</TableHead>
                                        <TableHead>Bid Amount</TableHead>
                                        <TableHead>Submitted On</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {bids.map(bid => (
                                        <TableRow key={bid.bid_id}>
                                            <TableCell>{bid.freelancer?.user.username ?? 'N/A'}</TableCell>
                                            <TableCell>${bid.bid_amount}</TableCell>
                                            <TableCell>{format(new Date(bid.submitted_at), 'PP')}</TableCell>
                                            <TableCell><Badge variant={getStatusBadgeVariant(bid.status)}>{formatStatus(bid.status)}</Badge></TableCell>
                                            <TableCell>
                                                <Button variant="link" size="sm" className="mr-2">View Proposal</Button>
                                                {/* Add Accept/Reject buttons */}
                                                {/* {bid.status === 'submitted' && (
                                    <>
                                     <Button variant="default" size="sm" className="mr-2">Accept</Button>
                                     <Button variant="destructive" size="sm">Reject</Button>
                                    </>
                                )} */}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Milestones Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Project Milestones</CardTitle>
                    {isClientOwner && <CardDescription>Define and track the key stages of your project.</CardDescription>}
                </CardHeader>
                <CardContent>
                    {milestones.length === 0 ? (
                        <p className="text-muted-foreground">No milestones defined for this project yet.</p>
                        // {isClientOwner && <Button variant="outline" size="sm" className="mt-2">Add Milestone</Button>}
                    ) : (
                        <ul className="space-y-4">
                            {milestones.map(milestone => (
                                <li key={milestone.milestone_id} className="p-4 border rounded-md flex justify-between items-start bg-secondary/50">
                                    <div>
                                        <h4 className="font-semibold">{milestone.title}</h4>
                                        <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                                        <p className="text-xs text-muted-foreground mt-2">Due: {format(new Date(milestone.due_date), 'PP')}</p>
                                    </div>
                                    <Badge variant={getStatusBadgeVariant(milestone.status)}>{formatStatus(milestone.status)}</Badge>
                                    {/* Add milestone actions (e.g., Mark as Complete, Request Payment) */}
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
                {isClientOwner && milestones.length > 0 && (
                    <CardFooter>
                        {/* <Button variant="outline" size="sm">Add Milestone</Button> */}
                    </CardFooter>
                )}
            </Card>


            {/* Messages/Chat Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><MessageSquare /> Messages</CardTitle>
                    <CardDescription>Communicate with the {user?.user_type === 'client' ? 'freelancer' : 'client'} regarding this project.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ScrollArea className="h-[400px] w-full border rounded-md p-4 bg-secondary/30" ref={messageListRef}>
                        {messages.length === 0 ? (
                            <p className="text-muted-foreground text-center py-10">No messages yet. Start the conversation!</p>
                        ) : (
                            messages.map((msg) => (
                                <div
                                    key={msg.message_id}
                                    className={cn(
                                        "mb-4 flex flex-col",
                                        msg.sender_id === user?.user_id ? "items-end" : "items-start"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "max-w-[70%] rounded-lg px-4 py-2",
                                            msg.sender_id === user?.user_id
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted text-muted-foreground"
                                        )}
                                    >
                                        <p className="text-sm">{msg.content}</p>
                                    </div>
                                    <span className="text-xs text-muted-foreground/70 mt-1">
                                        {msg.sender?.username ?? 'User'} - {format(new Date(msg.sent_at), 'p, PP')}
                                    </span>
                                </div>
                            ))
                        )}
                    </ScrollArea>
                    {/* Message Input Form */}
                    <form onSubmit={handleSendMessage} className="flex gap-2 items-center pt-4 border-t">
                        <Textarea
                            placeholder="Type your message here..."
                            value={newMessageContent}
                            onChange={(e) => setNewMessageContent(e.target.value)}
                            className="flex-1 resize-none"
                            rows={2}
                            disabled={isSending} // Disable while sending
                        />
                        {/* File Upload Button (optional) */}
                        {/* <Button variant="ghost" size="icon" type="button" disabled={isSending}>
                     <Paperclip className="h-5 w-5" />
                     <span className="sr-only">Attach file</span>
                 </Button> */}
                        <Button type="submit" disabled={!newMessageContent.trim() || isSending}>
                            <Send className="h-4 w-4 mr-2" />
                            {isSending ? 'Sending...' : 'Send'}
                        </Button>
                    </form>
                    {error && error.includes("message") && ( // Show message-specific errors near the form
                        <Alert variant="destructive" className="mt-2">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
