import type { Milestone } from './milestone';

export interface Invoice {
    invoice_id: number;
    milestone_id: number;
    amount: string; // Store as string if API returns it as such
    status: 'pending' | 'paid' | 'overdue' | 'cancelled'; // Define possible statuses
    paid_at: string | null; // ISO date string or null
    milestone?: Milestone; // Optional nesting
}
