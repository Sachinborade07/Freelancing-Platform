export interface Project {
    project_id: number;
    title: string;
    description: string;
    budget: number;
    status: 'draft' | 'posted' | 'in_progress' | 'completed';
    client_id: number;
    created_at: string;
    updated_at: string;
}

export interface CreateProjectData {
    title: string;
    description: string;
    budget: number;
}