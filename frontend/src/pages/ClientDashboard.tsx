import { useState, useEffect } from 'react';
import { useAuthStore } from '../auth/store';
import CreateProjectModal from './CreateProjectModel';
import UpdateProjectModal from './UpdateProjectModel';
import ProjectMessages from './ProjectMessage';
import { Project } from '../api/project/project';
import { Message } from '../types/message';
import EditMessageModal from './EditMessageModel';


const ClientDashboard = () => {
    const { user, logout, token } = useAuthStore();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [showMessages, setShowMessages] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [showEditMessageModal, setShowEditMessageModal] = useState(false);



    useEffect(() => {
        if (user?.user_id && token) {
            fetchClientProjects();
        }
    }, [user, token]);

    const fetchClientProjects = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`http://localhost:3000/projects/clients/${user?.user_id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }

            const data = await response.json();
            setProjects(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch projects');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async (projectData: {
        title: string;
        description: string;
        budget: string;
        deadline?: string;
    }) => {
        try {
            const response = await fetch('http://localhost:3000/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...projectData,
                    client_id: user?.user_id,
                    status: 'open',
                    deadline: projectData.deadline || null
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

    const handleUpdateProject = async (projectData: Partial<Project>) => {
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
        if (!selectedProject || !user) return;

        try {
            const response = await fetch('http://localhost:3000/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    project_id: selectedProject.project_id,
                    sender_id: user.user_id,
                    receiver_id: selectedProject.bids?.find(b => b.status === 'accepted')?.freelancer_id,
                    content
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

    const handleEditMessage = (message: Message) => {
        setSelectedMessage(message);
        setShowEditMessageModal(true);
    };

    const handleUpdateMessage = async (content: string) => {
        if (!selectedMessage) return;

        try {
            const response = await fetch(`http://localhost:3000/messages/${selectedMessage.message_id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content }),
            });

            if (!response.ok) {
                throw new Error('Failed to update message');
            }

            await fetchClientProjects();
            setShowEditMessageModal(false);
            setSelectedMessage(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error updating message');
        }
    };

    const handleDeleteMessage = async (messageId: number) => {
        try {
            if (!window.confirm('Are you sure you want to delete this message?')) {
                return;
            }

            const response = await fetch(`http://localhost:3000/messages/${messageId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete message');
            }

            await fetchClientProjects();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error deleting message');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return '#28a745';
            case 'in_progress': return '#17a2b8';
            case 'open': return '#ffc107';
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

    const countActiveBids = (bids?: any[]) => {
        return bids?.filter(b => b.status === 'accepted').length || 0;
    };

    const countPendingMilestones = (milestones?: any[]) => {
        return milestones?.filter(m => m.status === 'pending').length || 0;
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

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
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
                                    {project.description}
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
                                            ${project.budget}
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
                                            {countActiveBids(project.bids)}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.9rem', color: '#666' }}>Pending Milestones</div>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                            {countPendingMilestones(project.milestones)}
                                        </div>
                                    </div>
                                </div>

                                {project.client && (
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
                                )}

                                {project.freelancer && (
                                    <div style={{
                                        marginTop: '10px',
                                        borderTop: '1px solid #eee',
                                        paddingTop: '10px'
                                    }}>
                                        <p style={{ fontSize: '0.9rem', color: '#666' }}>Assigned Freelancer</p>
                                        <p style={{ fontWeight: 'bold' }}>
                                            {project.freelancer.user?.username || 'Not assigned'}
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
                    onCreate={handleCreateProject}
                    onClose={() => setShowCreateModal(false)}
                />
            )}

            {showUpdateModal && selectedProject && (
                <UpdateProjectModal
                    project={selectedProject}
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
                    messages={selectedProject?.messages || []}
                    onSendMessage={handleSendMessage}
                    onEditMessage={handleEditMessage}
                    onDeleteMessage={handleDeleteMessage}
                    onClose={() => {
                        setShowMessages(false);
                        setSelectedProject(null);
                    }}
                />
            )}

            {showEditMessageModal && selectedMessage && (
                <EditMessageModal
                    message={selectedMessage}
                    onUpdate={handleUpdateMessage}
                    onClose={() => setShowEditMessageModal(false)}
                />
            )}
        </div>
    );
};

export default ClientDashboard;