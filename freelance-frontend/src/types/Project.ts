import type { Client } from './client';
import type { Bid } from './bid';
import type { Milestone } from './milestone';
import type { Message } from './message';

export interface Project {
    project_id: number;
    client_id: number;
    title: string;
    description: string;
    budget: string; // Store as string if API returns it as such
    status: 'open' | 'in_progress' | 'completed' | 'cancelled'; // Define possible statuses
    created_at: string; // ISO date string
    deadline: string | null; // ISO date string or null
    client?: Client; // Optional nesting
    bids?: Bid[]; // Optional nesting
    milestones?: Milestone[]; // Optional nesting
    messages?: Message[]; // Optional nesting
}

// Type for the API response structure which includes 'data' and 'count'
export interface ProjectsApiResponse {
    data: Project[];
    count: number;
}
