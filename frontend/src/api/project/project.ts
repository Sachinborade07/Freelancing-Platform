import { Client } from "../../types/client";
import { Freelancer } from "../../types/freelancer";

export interface Project {
    project_id: number;
    title: string;
    description: string;
    budget: string;
    freelancer_id: number;
    status: 'open' | 'in_progress' | 'completed';
    created_at: string;
    deadline: string | null;
    client_id: number;
    client: Client;
    freelancer?: Freelancer
    milestones?: Array<{
        milestone_id: number;
        title: string;
        status: string;
        due_date: string;
    }>;
    bids?: Array<{
        bid_id: number;
        status: string;
        freelancer_id: number;
    }>;
    messages?: Array<{
        message_id: number;
        content: string;
        sent_at: string;
        sender_id: number;
    }>;
}

export interface ProjectsApiResponse {
    data: Project[];
    count: number;
}

export interface CreateProjectData {
    title: string;
    description: string;
    budget: number;
}