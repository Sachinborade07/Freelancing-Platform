import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api/Project'
import { Project } from '../types/Project';

const ProjectListPage = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const { token, user } = useAuth();

    // Fetch projects based on user type
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                let data;
                if (user?.user_type === 'client') {
                    data = await api.getClientProjects(user.user_id, token!); // Get client-specific projects
                } else {
                    data = (await api.getProjects(token!)).data; // Get all projects for non-clients
                }
                setProjects(data);
            } catch (error) {
                // Handle error if fetching projects fails
                console.error('Failed to fetch projects:', error);
            } finally {
                setLoading(false); // Stop loading when done
            }
        };

        if (token && user) {
            fetchProjects();
        }
    }, [token, user]);

    // Show loading state while fetching projects
    if (loading) {
        return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</p>;
    }

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h1>{user?.user_type === 'client' ? 'My Projects' : 'Available Projects'}</h1>
                {user?.user_type === 'client' && (
                    <Link to="/projects/create">
                        <button>Create New Project</button>
                    </Link>
                )}
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '1.5rem',
                }}
            >
                {projects.map((project) => (
                    <div
                        key={project.project_id}
                        style={{
                            border: '1px solid #ccc',
                            padding: '1rem',
                            borderRadius: '6px',
                            backgroundColor: '#f9f9f9',
                        }}
                    >
                        <h3>{project.title}</h3>
                        <span
                            style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                backgroundColor:
                                    project.status === 'posted'
                                        ? '#007bff'
                                        : project.status === 'completed'
                                            ? '#28a745'
                                            : project.status === 'in_progress'
                                                ? '#ffc107'
                                                : '#6c757d',
                                color: 'white',
                                fontSize: '0.8rem',
                            }}
                        >
                            {project.status.replace('_', ' ')}
                        </span>
                        <p style={{ marginTop: '1rem' }}>
                            {project.description.length > 100
                                ? `${project.description.substring(0, 100)}...`
                                : project.description}
                        </p>
                        <p><strong>Budget:</strong> ${project.budget}</p>
                        <Link to={`/projects/${project.project_id}`}>
                            <button>View Details</button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectListPage;
