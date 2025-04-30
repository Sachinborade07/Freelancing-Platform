import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/Project';

const CreateProjectPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState('');
    const [error, setError] = useState('');
    const { token } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await api.createProject(
                {
                    title,
                    description,
                    budget: Number(budget),
                },
                token!
            );
            navigate('/projects');
        } catch {
            setError('Failed to create project');
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <h2>Create New Project</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Title:
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ width: '100%', marginBottom: '1rem' }}
                    />
                </label>
                <label>
                    Description:
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        style={{ width: '100%', height: '100px', marginBottom: '1rem' }}
                    />
                </label>
                <label>
                    Budget:
                    <input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        required
                        min="1"
                        style={{ width: '100%', marginBottom: '1rem' }}
                    />
                </label>
                <button type="submit">Create</button>
            </form>
        </div>
    );
};

export default CreateProjectPage;
