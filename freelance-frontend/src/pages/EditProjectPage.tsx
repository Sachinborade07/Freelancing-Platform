import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/Project';
import { Project } from '../types/Project';

const EditProjectPage = () => {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState('');
    const [error, setError] = useState('');
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const data = await api.getProjectById(Number(id), token!);
                setProject(data);
                setTitle(data.title);
                setDescription(data.description);
                setBudget(data.budget.toString());
            } catch {
                setError('Failed to fetch project details.');
                navigate('/projects');
            }
        };

        if (token) {
            fetchProject();
        }
    }, [id, token, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.updateProject(
                Number(id),
                { title, description, budget: Number(budget) },
                token!
            );
            navigate(`/projects/${id}`);
        } catch {
            setError('Failed to update project.');
        }
    };

    if (!project) {
        return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</p>;
    }

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <h1>Edit Project</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.5rem' }}
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows={4}
                        style={{ width: '100%', padding: '0.5rem' }}
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Budget</label>
                    <input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        required
                        min={1}
                        style={{ width: '100%', padding: '0.5rem' }}
                    />
                </div>
                <button type="submit" style={{ padding: '0.7rem 1.5rem' }}>
                    Update Project
                </button>
            </form>
        </div>
    );
};

export default EditProjectPage;
