import { useState, useEffect } from 'react';
import { useAuthStore } from '../auth/store';
import CreateProjectModal from './CreateProjectModel';
import UpdateProjectModal from './UpdateProjectModel';
import ProjectMessages from './ProjectMessage';
import { Project } from '../api/project/project';
import { Freelancer } from '../types/freelancer';

const ClientDashboard = () => {
    const { user, logout, token } = useAuthStore();
    const [projects, setProjects] = useState<Project[]>([]);
    const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
    const [loading, setLoading] = useState(true);
    const [freelancersLoading, setFreelancersLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [showMessages, setShowMessages] = useState(false);
    const [showFreelancersPopup, setShowFreelancersPopup] = useState(false);

    useEffect(() => {
        if (user?.user_id && token) {
            fetchClientProjects();
            fetchFreelancers();
        }
    }, [user, token]);

    const fetchClientProjects = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`http://localhost:3000/projects/clients/${user?.user_id}`, {
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

    const fetchFreelancers = async () => {
        try {
            setFreelancersLoading(true);
            const response = await fetch('http://localhost:3000/freelancers', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch freelancers');
            }

            const data: Freelancer[] = await response.json();
            setFreelancers(data);
        } catch (err) {
            console.error('Fetch freelancers error:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch freelancers');
        } finally {
            setFreelancersLoading(false);
        }
    };

    const handleCreateProject = async (projectData: {
        title: string;
        description: string;
        budget: string;
        deadline?: string;
        freelancer_id?: number;
    }) => {
        try {
            const response = await fetch('http://localhost:3000/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: projectData.title,
                    description: projectData.description,
                    budget: Number(projectData.budget),
                    client_id: user?.user_id,
                    status: 'draft',
                    deadline: projectData.deadline || null,
                    freelancer_id: projectData.freelancer_id || null
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create project');
            }

            await fetchClientProjects();
            setShowCreateModal(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error creating project');
            console.error(err);
        }
    };

    const handleUpdateProject = async (projectData: {
        title?: string;
        description?: string;
        budget?: number;
        status?: string;
        deadline?: string | null;
        freelancer_id?: number;
    }) => {
        if (!selectedProject) return;

        try {
            const response = await fetch(
                `http://localhost:3000/projects/${selectedProject.project_id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(projectData),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update project');
            }

            await fetchClientProjects();
            setShowUpdateModal(false);
            setSelectedProject(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error updating project');
            console.error(err);
        }
    };

    const handleDeleteProject = async (projectId: number) => {
        try {
            if (!window.confirm('Are you sure you want to delete this project?')) {
                return;
            }

            const response = await fetch(
                `http://localhost:3000/projects/${projectId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to delete project');
            }

            await fetchClientProjects();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error deleting project');
            console.error(err);
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
                    receiver_id: selectedProject.freelancer_id || undefined
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            await fetchClientProjects();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error sending message');
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

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <div>Loading your projects...</div>
            </div>
        );
    }

    const freelancerCardStyle = {
        padding: '15px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        backgroundColor: '#fff',
        transition: 'all 0.2s',
        '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transform: 'translateY(-2px)'
        }
    };

    const avatarStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#17a2b8',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        marginRight: '10px'
    };

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
                        <h1>Client Dashboard</h1>
                        <p style={{ fontSize: '1.2rem', marginTop: '5px' }}>
                            Welcome, <strong>{user?.username}</strong>!
                        </p>
                    </div>
                    <div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                marginRight: '10px',
                                fontWeight: 'bold'
                            }}
                        >
                            + Create Project
                        </button>
                        <button
                            onClick={() => setShowFreelancersPopup(true)}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#17a2b8',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                marginRight: '10px',
                                fontWeight: 'bold'
                            }}
                        >
                            View Freelancers
                        </button>
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

                {projects.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        border: '1px dashed #ddd',
                        borderRadius: '8px',
                        backgroundColor: '#f8f9fa'
                    }}>
                        <h3>No Projects Found</h3>
                        <p>You haven't created any projects yet.</p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                marginTop: '15px'
                            }}
                        >
                            Create Your First Project
                        </button>
                    </div>
                ) : (
                    <div>
                        <h2 style={{ marginBottom: '20px' }}>Your Projects ({projects.length})</h2>
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
                                            <div style={{ fontSize: '0.9rem', color: '#666' }}>Active Bids</div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                {project.bids?.filter(b => b.status === 'accepted').length || 0}
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
                                        borderTop: '1px solid #eee',
                                        paddingTop: '10px',
                                        marginBottom: '15px'
                                    }}>
                                        <p style={{ fontSize: '0.9rem', color: '#666' }}>Client Information</p>
                                        <p style={{ fontWeight: 'bold' }}>{project.client.company_name}</p>
                                        <p style={{ fontSize: '0.9rem', color: '#555' }}>
                                            {project.client.address}
                                        </p>
                                    </div>

                                    {project.freelancer_id && (
                                        <div style={{
                                            marginTop: '10px',
                                            borderTop: '1px solid #eee',
                                            paddingTop: '10px'
                                        }}>
                                            <p style={{ fontSize: '0.9rem', color: '#666' }}>Assigned Freelancer</p>
                                            <p style={{ fontWeight: 'bold' }}>
                                                {project.freelancer?.user?.username || `Freelancer #${project.freelancer_id}`}
                                            </p>
                                            <p style={{ fontSize: '0.9rem', color: '#555' }}>
                                                Hourly Rate: {formatCurrency(project.freelancer?.hourly_rate)}
                                            </p>
                                        </div>
                                    )}

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
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                onClick={() => {
                                                    setSelectedProject(project);
                                                    setShowUpdateModal(true);
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
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProject(project.project_id)}
                                                style={{
                                                    padding: '8px 15px',
                                                    backgroundColor: '#dc3545',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '5px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {showCreateModal && (
                    <CreateProjectModal
                        freelancers={freelancers}
                        onCreate={handleCreateProject}
                        onClose={() => setShowCreateModal(false)}
                    />
                )}

                {showUpdateModal && selectedProject && (
                    <UpdateProjectModal
                        project={selectedProject}
                        freelancers={freelancers}
                        onUpdate={handleUpdateProject}
                        onClose={() => {
                            setShowUpdateModal(false);
                            setSelectedProject(null);
                        }}
                    />
                )}

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

                {/* Freelancers Popup */}
                {showFreelancersPopup && (
                    <div style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '90%',  // Increased width
                        maxWidth: '1000px',  // Increased max width
                        maxHeight: '90vh',  // Increased height
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                        padding: '20px',
                        zIndex: 1000,
                        overflowY: 'auto'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '20px',
                            paddingBottom: '10px',
                            borderBottom: '1px solid #e0e0e0'
                        }}>
                            <h2 style={{ margin: 0 }}>Available Freelancers</h2>
                            <button
                                onClick={() => setShowFreelancersPopup(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    color: '#666'
                                }}
                            >
                                ×
                            </button>
                        </div>

                        {freelancersLoading ? (
                            <div>Loading freelancers...</div>
                        ) : freelancers.length === 0 ? (
                            <div>No freelancers available</div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
                                {freelancers.map(freelancer => {
                                    const firstLetter = freelancer.user?.username?.charAt(0).toUpperCase() || 'F';

                                    return (
                                        <div
                                            key={freelancer.freelancer_id}
                                            style={{
                                                ...freelancerCardStyle,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                <div style={avatarStyle}>
                                                    {firstLetter}
                                                </div>
                                                <div>
                                                    <h3 style={{ margin: '0', color: '#333' }}>
                                                        {freelancer.user?.username || `Freelancer #${freelancer.freelancer_id}`}
                                                    </h3>
                                                    <p style={{ margin: '0', color: '#555', fontSize: '0.8rem' }}>
                                                        {freelancer.experience || 'No experience specified'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <p style={{ margin: '0 0 5px 0', color: '#555', fontSize: '0.9rem' }}>
                                                    <strong>Rate:</strong> {formatCurrency(freelancer.hourly_rate ?? 0)}/hr
                                                </p>
                                                <p style={{ margin: '0 0 5px 0', color: '#555', fontSize: '0.9rem' }}>
                                                    <strong>Skills:</strong> {freelancer.skills?.slice(0, 2).map(s => s?.skill?.name).filter(Boolean).join(', ') || 'None'}
                                                </p>
                                            </div>

                                            <p style={{
                                                margin: '10px 0 0 0',
                                                color: '#666',
                                                fontSize: '0.8rem',
                                                fontStyle: 'italic',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>
                                                "{freelancer.bio || 'No bio provided'}"
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Overlay for popup */}
                {showFreelancersPopup && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 999
                    }}
                        onClick={() => setShowFreelancersPopup(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default ClientDashboard;