import { useState, useEffect } from 'react';
import { useAuthStore } from '../auth/store';
import ProjectMessages from './ProjectMessage';
import { Project } from '../api/project/project';


const FreelancerDashboard = () => {
    const { user, logout, token } = useAuthStore();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showMessages, setShowMessages] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [bids, setBids] = useState<any[]>([]);
    const [bidsLoading, setBidsLoading] = useState(true);

    useEffect(() => {
        if (user?.user_id && token) {
            fetchFreelancerProjects();
            fetchFreelancerBids();
        }
    }, [user, token]);

    const fetchFreelancerProjects = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`http://localhost:3000/projects/freelancers/${user?.user_id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch projects');
            }

            const data: Project[] = await response.json();
            setProjects(data);

        } catch (err) {
            console.error('Fetch error:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch projects');
        } finally {
            setLoading(false);
        }
    };

    const fetchFreelancerBids = async () => {
        try {
            setBidsLoading(true);
            const response = await fetch(`http://localhost:3000/bids/freelancers/${user?.user_id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch bids');
            }

            const data = await response.json();
            setBids(data);
        } catch (err) {
            console.error('Fetch bids error:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch bids');
        } finally {
            setBidsLoading(false);
        }
    };

    const handleSendMessage = async (content: string) => {
        if (!selectedProject) return;

        try {
            const response = await fetch('http://localhost:3000/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    content,
                    project_id: selectedProject.project_id,
                    sender_id: user?.user_id,
                    receiver_id: selectedProject.client_id
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            await fetchFreelancerProjects();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error sending message');
            console.error(err);
        }
    };

    const handleSubmitBid = async (projectId: number, bidAmount: number, proposal: string) => {
        try {
            const response = await fetch('http://localhost:3000/bids', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    project_id: projectId,
                    freelancer_id: user?.user_id,
                    bid_amount: bidAmount,
                    proposal: proposal,
                    status: 'submitted'
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit bid');
            }

            await fetchFreelancerBids();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error submitting bid');
            console.error(err);
        }
    };

    const handleUpdateBid = async (bidId: number, bidAmount: number, proposal: string) => {
        try {
            const response = await fetch(`http://localhost:3000/bids/${bidId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    bid_amount: bidAmount,
                    proposal: proposal
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update bid');
            }

            await fetchFreelancerBids();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error updating bid');
            console.error(err);
        }
    };

    const handleWithdrawBid = async (bidId: number) => {
        try {
            if (!window.confirm('Are you sure you want to withdraw this bid?')) {
                return;
            }

            const response = await fetch(`http://localhost:3000/bids/${bidId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: 'withdrawn'
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to withdraw bid');
            }

            await fetchFreelancerBids();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error withdrawing bid');
            console.error(err);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed': return '#28a745';
            case 'in_progress': return '#17a2b8';
            case 'open': return '#ffc107';
            case 'posted': return '#007bff';
            case 'draft': return '#6c757d';
            case 'cancelled': return '#dc3545';
            default: return '#6c757d';
        }
    };

    const getBidStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'accepted': return '#28a745';
            case 'submitted': return '#17a2b8';
            case 'rejected': return '#dc3545';
            case 'withdrawn': return '#6c757d';
            default: return '#6c757d';
        }
    };

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount: string | number | null | undefined) => {
        if (amount === undefined || amount === null) return '$0.00';
        const num = typeof amount === 'string' ? parseFloat(amount) : amount;
        return `$${num.toFixed(2)}`;
    };

    if (loading || bidsLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <div>Loading your dashboard...</div>
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: '#f5f5f5',
            position: 'relative'
        }}>
            {/* Main Content */}
            <div style={{
                flex: 1,
                padding: '20px',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                }}>
                    <div>
                        <h1>Freelancer Dashboard</h1>
                        <p style={{ fontSize: '1.2rem', marginTop: '5px' }}>
                            Welcome, <strong>{user?.username}</strong>!
                        </p>
                    </div>
                    <div>
                        <button
                            onClick={logout}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {error && (
                    <div style={{
                        color: 'white',
                        backgroundColor: '#dc3545',
                        padding: '10px',
                        borderRadius: '5px',
                        margin: '10px 0',
                        textAlign: 'center'
                    }}>
                        {error}
                        <button
                            onClick={() => setError(null)}
                            style={{
                                marginLeft: '10px',
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer'
                            }}
                        >
                            ×
                        </button>
                    </div>
                )}

                <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ marginBottom: '20px' }}>Your Active Bids ({bids.length})</h2>
                    {bids.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px',
                            border: '1px dashed #ddd',
                            borderRadius: '8px',
                            backgroundColor: '#f8f9fa'
                        }}>
                            <h3>No Active Bids</h3>
                            <p>You haven't submitted any bids yet.</p>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                            gap: '20px'
                        }}>
                            {bids.map(bid => (
                                <div key={bid.bid_id} style={{
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '10px',
                                    padding: '20px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    backgroundColor: 'white',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        marginBottom: '15px'
                                    }}>
                                        <h3 style={{ margin: '0', color: '#333', fontSize: '1.3rem' }}>
                                            {bid.project?.title || 'Project'}
                                        </h3>
                                        <span style={{
                                            backgroundColor: getBidStatusColor(bid.status),
                                            color: 'white',
                                            padding: '5px 10px',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            textTransform: 'capitalize'
                                        }}>
                                            {bid.status.replace('_', ' ')}
                                        </span>
                                    </div>

                                    <p style={{ color: '#555', marginBottom: '15px', minHeight: '60px' }}>
                                        <strong>Your Proposal:</strong> {bid.proposal || 'No proposal provided'}
                                    </p>

                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '10px',
                                        marginBottom: '15px'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '0.9rem', color: '#666' }}>Bid Amount</div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                {formatCurrency(bid.bid_amount)}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.9rem', color: '#666' }}>Submitted At</div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                {formatDate(bid.submitted_at)}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginTop: '20px'
                                    }}>
                                        {bid.status === 'submitted' && (
                                            <>
                                                <button
                                                    onClick={() => handleWithdrawBid(bid.bid_id)}
                                                    style={{
                                                        padding: '8px 15px',
                                                        backgroundColor: '#dc3545',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '5px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Withdraw Bid
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const newAmount = prompt('Enter new bid amount:', bid.bid_amount);
                                                        const newProposal = prompt('Enter new proposal:', bid.proposal);
                                                        if (newAmount && newProposal) {
                                                            handleUpdateBid(bid.bid_id, parseFloat(newAmount), newProposal);
                                                        }
                                                    }}
                                                    style={{
                                                        padding: '8px 15px',
                                                        backgroundColor: '#ffc107',
                                                        color: 'black',
                                                        border: 'none',
                                                        borderRadius: '5px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Update Bid
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <h2 style={{ marginBottom: '20px' }}>Your Projects ({projects.length})</h2>
                    {projects.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px',
                            border: '1px dashed #ddd',
                            borderRadius: '8px',
                            backgroundColor: '#f8f9fa'
                        }}>
                            <h3>No Assigned Projects</h3>
                            <p>You haven't been assigned to any projects yet.</p>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                            gap: '20px'
                        }}>
                            {projects.map(project => (
                                <div key={project.project_id} style={{
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '10px',
                                    padding: '20px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    backgroundColor: 'white',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        marginBottom: '15px'
                                    }}>
                                        <h3 style={{ margin: '0', color: '#333', fontSize: '1.3rem' }}>
                                            {project.title}
                                        </h3>
                                        <span style={{
                                            backgroundColor: getStatusColor(project.status),
                                            color: 'white',
                                            padding: '5px 10px',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            textTransform: 'capitalize'
                                        }}>
                                            {project.status.replace('_', ' ')}
                                        </span>
                                    </div>

                                    <p style={{ color: '#555', marginBottom: '15px', minHeight: '60px' }}>
                                        {project.description || 'No description provided'}
                                    </p>

                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '10px',
                                        marginBottom: '15px'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '0.9rem', color: '#666' }}>Budget</div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                {formatCurrency(project.budget)}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.9rem', color: '#666' }}>Deadline</div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                {formatDate(project.deadline)}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.9rem', color: '#666' }}>Client</div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                {project.client.company_name}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.9rem', color: '#666' }}>Created At</div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                {formatDate(project.created_at)}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginTop: '20px'
                                    }}>
                                        <button
                                            onClick={() => {
                                                setSelectedProject(project);
                                                setShowMessages(true);
                                            }}
                                            style={{
                                                padding: '8px 15px',
                                                backgroundColor: '#17a2b8',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Messages ({project.messages?.length || 0})
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {showMessages && selectedProject && (
                    <ProjectMessages
                        project={selectedProject}
                        currentUserId={user?.user_id || 0}
                        messages={selectedProject.messages || []}
                        onSendMessage={handleSendMessage}
                        onClose={() => {
                            setShowMessages(false);
                            setSelectedProject(null);
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default FreelancerDashboard;