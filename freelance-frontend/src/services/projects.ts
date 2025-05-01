export interface Project {
    project_id: number;
    client_id: number;
    title: string;
    description: string;
    budget: string;
    status: 'open' | 'in_progress' | 'completed' | 'cancelled';
    created_at: string;
    deadline: string | null;
    client?: {
        client_id: number;
        user_id: number;
        company_name: string | null;
        address: string | null;
        user?: {
            user_id: number;
            username: string;
        };
    };
}
