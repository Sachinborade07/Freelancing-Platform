import { useEffect, useState } from 'react';
import project from '../api/project';
import { useAuth } from '../context/AuthContext';
import { Project } from '../types/Project';

const ClientProjects = () => {
    const { user, token } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await project.getProjects(token!);
                const clientProjects = response.data.filter(p => user && p.client.user_id === user.user_id);
                setProjects(clientProjects);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        if (token && user?.user_id) fetchProjects();
    }, [token, user]);

    // Handle delete project
    const handleDelete = async (id: number) => {
        try {
            await project.deleteProject(id, token!);
            setProjects(prevProjects => prevProjects.filter(p => p.project_id !== id));
            alert('Project deleted successfully');
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Failed to delete project');
        }
    };

    // Handle update project status
    const handleUpdateStatus = async (id: number, status: 'draft' | 'posted' | 'in_progress' | 'completed') => {
        try {
            const updatedProject = await project.updateProjectStatus(id, status, token!);
            setProjects(prevProjects =>
                prevProjects.map(p => p.project_id === id ? updatedProject : p)
            );
            alert(`Project status updated to ${status}`);
        } catch (error) {
            console.error('Error updating project status:', error);
            alert('Failed to update project status');
        }
    };

    return (
        <div>
            <h2>Your Projects</h2>
            {projects.length === 0 ? (
                <p>No projects found.</p>
            ) : (
                <div className="project-cards">
                    {projects.map((p) => (
                        <div key={p.project_id} className="project-card">
                            <h3>{p.title}</h3>
                            <p>{p.description}</p>
                            <p><strong>Status:</strong> {p.status}</p>
                            <p><strong>Budget:</strong> ${p.budget}</p>
                            <p><strong>Deadline:</strong> {p.deadline instanceof Date ? p.deadline.toLocaleDateString() : p.deadline}</p>
                            <p><strong>Company:</strong> {p.client.company_name}</p>

                            {/* Update button */}
                            <div>
                                {p.status !== 'completed' && (
                                    <button onClick={() => handleUpdateStatus(p.project_id, 'completed')}>
                                        Mark as Completed
                                    </button>
                                )}
                                {p.status !== 'in_progress' && (
                                    <button onClick={() => handleUpdateStatus(p.project_id, 'in_progress')}>
                                        Mark as In Progress
                                    </button>
                                )}
                                <button onClick={() => handleDelete(p.project_id)}>
                                    Delete Project
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClientProjects;
