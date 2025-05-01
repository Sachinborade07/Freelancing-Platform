import type { Milestone } from './milestone';

export interface Invoice {
    invoice_id: number;
    milestone_id: number;
    amount: string;
    status: 'pending' | 'paid' | 'overdue' | 'cancelled';
    paid_at: string | null;
    milestone?: Milestone;
}
