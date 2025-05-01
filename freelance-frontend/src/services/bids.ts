import { User } from "../types/User";

export interface Bid {
    bid_id: number;
    project_id: number;
    freelancer_id: number;
    bid_amount: string;
    proposal: string;
    status: 'submitted' | 'accepted' | 'rejected' | 'withdrawn';
    submitted_at: string;
    project?: {
        project_id: number;
        title: string;
    };
    freelancer?: {
        freelancer_id: number;
        user_id: number;
        user?: User;
    };
}