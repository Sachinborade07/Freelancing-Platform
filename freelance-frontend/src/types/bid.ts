import type { Project } from './Project';
import type { Freelancer } from './freelancer';

export interface Bid {
    bid_id: number;
    project_id: number;
    freelancer_id: number;
    bid_amount: string; // Store as string if API returns it as such
    proposal: string;
    status: 'submitted' | 'accepted' | 'rejected' | 'withdrawn'; // Define possible statuses
    submitted_at: string; // ISO date string
    project?: Project;     // Optional nesting
    freelancer?: Freelancer; // Optional nesting
}
