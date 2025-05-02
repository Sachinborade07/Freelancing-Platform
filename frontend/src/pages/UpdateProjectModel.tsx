import { useState, useEffect } from 'react';
import { Project } from '../api/project/project';
import { Freelancer } from '../types/freelancer';

interface UpdateProjectModalProps {
    project: Project;
    freelancers: Freelancer[];
    onUpdate: (projectData: {
        title?: string;
        description?: string;
        budget?: number;
        status?: string;
        deadline?: string | null;
        freelancer_id?: number;
    }) => Promise<void>;
    onClose: () => void;
}

const UpdateProjectModal = ({ project, freelancers, onUpdate, onClose }: UpdateProjectModalProps) => {
    const [formData, setFormData] = useState({
        title: project.title,
        description: project.description || '',
        budget: project.budget || 0,
        status: project.status,
        deadline: project.deadline || '',
        freelancer_id: project.freelancer_id || undefined
    });

    useEffect(() => {
        setFormData({
            title: project.title,
            description: project.description || '',
            budget: project.budget || 0,
            status: project.status,
            deadline: project.deadline || '',
            freelancer_id: project.freelancer_id || undefined
        });
    }, [project]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate({
            title: formData.title,
            description: formData.description,
            budget: typeof formData.budget === 'string' ? Number(formData.budget) : formData.budget,
            status: formData.status,
            deadline: formData.deadline || null,
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
                <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Update Project</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ced4da'
                            }}
                        />
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
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Budget</label>
                        <input
                            type="number"
                            value={formData.budget}
                            onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ced4da'
                            }}
                        />
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

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) =>
                                setFormData({ ...formData, status: e.target.value as 'draft' | 'posted' | 'in_progress' | 'completed' | 'cancelled' })
                            }
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ced4da'
                            }}
                        >
                            <option value="draft">Draft</option>
                            <option value="posted">Posted</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Assigned Freelancer</label>
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
                                backgroundColor: '#17a2b8',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Update Project
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProjectModal;