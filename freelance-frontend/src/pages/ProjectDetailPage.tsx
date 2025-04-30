import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/Project';
import { Project } from '../types/Project';
import BidList from '../components/BidList';

const ProjectDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const data = await api.getProjectById(Number(id), token!);
                setProject(data);
            } catch {
                setError('Failed to load project');
                navigate('/projects');
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchProject();
    }, [id, token, navigate]);

    const handleStatusChange = async (status: 'posted' | 'in_progress' | 'completed') => {
        try {
            const updated = await api.updateProjectStatus(Number(id), status, token!);
            setProject(updated);
        } catch {
            setError('Failed to update status');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!project) return <p>No project found.</p>;

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h2>{project.title}</h2>
            <p>Status: {project.status.replace('_', ' ')}</p>
            <p>{project.description}</p>
            <p>Budget: ${project.budget}</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {user?.user_type === 'client' && user.user_id === project.client_id && (
                <div style={{ margin: '1rem 0' }}>
                    {project.status === 'draft' && (
                        <button onClick={() => handleStatusChange('posted')}>Post Project</button>
                    )}
                    {project.status === 'posted' && (
                        <button onClick={() => handleStatusChange('in_progress')}>Mark as In Progress</button>
                    )}
                    {project.status === 'in_progress' && (
                        <button onClick={() => handleStatusChange('completed')}>Mark as Completed</button>
                    )}
                    <Link to={`/projects/${project.project_id}/edit`} style={{ marginLeft: '1rem' }}>
                        Edit
                    </Link>
                </div>
            )}

            <hr style={{ margin: '2rem 0' }} />
            <BidList projectId={project.project_id} />
        </div>
    );
};

export default ProjectDetailPage;
