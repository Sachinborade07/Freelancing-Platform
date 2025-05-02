import { useState } from 'react';
import { Freelancer } from '../types/freelancer';

interface CreateProjectModalProps {
    freelancers: Freelancer[];
    onCreate: (projectData: {
        title: string;
        description: string;
        budget: string;
        deadline?: string;
        freelancer_id?: number;
    }) => Promise<void>;
    onClose: () => void;
}

const CreateProjectModal = ({ freelancers, onCreate, onClose }: CreateProjectModalProps) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        budget: '',
        deadline: '',
        freelancer_id: undefined as number | undefined
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.title) newErrors.title = 'Title is required';
        if (!formData.budget) newErrors.budget = 'Budget is required';
        if (formData.budget && isNaN(Number(formData.budget))) newErrors.budget = 'Budget must be a number';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        onCreate({
            title: formData.title,
            description: formData.description,
            budget: formData.budget,
            deadline: formData.deadline || undefined,
            freelancer_id: formData.freelancer_id
        });
    };

    const getAvatarStyle = (color: string) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        backgroundColor: color,
        color: 'white',
        fontWeight: 'bold',
        fontSize: '0.9rem',
        marginRight: '10px'
    });

    const colors = ['#17a2b8', '#28a745', '#6f42c1', '#fd7e14', '#e83e8c'];

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '25px',
                borderRadius: '8px',
                width: '500px',
                maxWidth: '90%',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Create New Project</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: errors.title ? '1px solid #dc3545' : '1px solid #ced4da'
                            }}
                        />
                        {errors.title && <span style={{ color: '#dc3545', fontSize: '0.8rem' }}>{errors.title}</span>}
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ced4da',
                                minHeight: '100px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Budget *</label>
                        <input
                            type="text"
                            value={formData.budget}
                            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: errors.budget ? '1px solid #dc3545' : '1px solid #ced4da'
                            }}
                        />
                        {errors.budget && <span style={{ color: '#dc3545', fontSize: '0.8rem' }}>{errors.budget}</span>}
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Deadline</label>
                        <input
                            type="date"
                            value={formData.deadline}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ced4da'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Assign to Freelancer</label>
                        <div style={{
                            border: '1px solid #ced4da',
                            borderRadius: '8px',
                            padding: '10px',
                            maxHeight: '200px',
                            overflowY: 'auto'
                        }}>
                            {freelancers.length === 0 ? (
                                <p style={{ textAlign: 'center', color: '#6c757d' }}>No freelancers available</p>
                            ) : (
                                freelancers.map((freelancer, index) => {
                                    const firstLetter = freelancer.user?.username?.charAt(0).toUpperCase() || 'F';
                                    const color = colors[index % colors.length];

                                    return (
                                        <div
                                            key={freelancer.freelancer_id}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '8px',
                                                borderRadius: '4px',
                                                backgroundColor: formData.freelancer_id === freelancer.freelancer_id ? '#f0f8ff' : 'transparent',
                                                cursor: 'pointer',
                                                marginBottom: '5px',
                                                border: formData.freelancer_id === freelancer.freelancer_id ? '1px solid #17a2b8' : '1px solid transparent'
                                            }}
                                            onClick={() => setFormData(prev => ({
                                                ...prev,
                                                freelancer_id: freelancer.freelancer_id
                                            }))}
                                        >
                                            <div style={getAvatarStyle(color)}>
                                                {firstLetter}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ margin: 0, fontWeight: 'bold' }}>
                                                    {freelancer.user?.username || `Freelancer #${freelancer.freelancer_id}`}
                                                </p>
                                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#6c757d' }}>
                                                    {freelancer.skills?.slice(0, 2).map(s => s?.skill?.name).filter(Boolean).join(', ') || 'No skills'}
                                                </p>
                                            </div>
                                            {formData.freelancer_id === freelancer.freelancer_id && (
                                                <span style={{ color: '#28a745', fontWeight: 'bold' }}>✓</span>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Create Project
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProjectModal;