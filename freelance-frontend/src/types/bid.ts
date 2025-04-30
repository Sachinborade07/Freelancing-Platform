export interface Bid {
    bid_id: number;
    project_id: number;
    freelancer_id: number;
    bid_amount: number;
    proposal: string;
    status: 'submitted' | 'accepted' | 'rejected';
    created_at: string;
    updated_at: string;
    freelancer_username?: string;
    project_title?: string;
}

export interface CreateBidData {
    project_id: number;
    bid_amount: number;
    proposal: string;
}