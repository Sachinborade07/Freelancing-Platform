import { Message } from "../../types/message";
import { Milestone } from "../../types/milestone";
import { Bid } from "../bid/bid";

export interface Project {
    project_id: number;
    title: string;
    description: string;
    budget: number;
    status: 'draft' | 'posted' | 'in_progress' | 'completed' | 'cancelled';
    created_at: string;
    deadline: string | null;
    client_id: number;
    freelancer_id: number | null;
    client: {
        client_id: number;
        user_id: number;
        company_name: string;
        address: string;
    };
    freelancer?: {
        freelancer_id: number;
        user_id: number;
        bio?: string;
        experience?: string;
        hourly_rate?: number;
        user?: {
            user_id: number;
            username: string;
        };
    } | null;
    milestones?: Milestone[];
    bids?: Bid[];
    messages?: Message[];
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