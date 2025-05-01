import { Freelancer } from "../../types/freelancer";
import { Project } from "../project/project";


export interface Bid {
    bid_id: number;
    project_id: number;
    freelancer_id: number;
    bid_amount: string;
    proposal: string;
    status: 'submitted' | 'accepted' | 'rejected' | 'withdrawn';
    submitted_at: string;
    project?: Project;
    freelancer?: Freelancer;
}

export interface CreateBidData {
    project_id: number;
    bid_amount: number;
    proposal: string;
}