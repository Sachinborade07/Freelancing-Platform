import type { Project } from './Project';
import type { Invoice } from './invoice';

export interface Milestone {
    milestone_id: number;
    project_id: number;
    title: string;
    description: string;
    due_date: string; // ISO date string
    status: 'pending' | 'in_progress' | 'completed' | 'overdue'; // Define possible statuses
    project?: Project; // Optional nesting
    invoices?: Invoice[]; // Optional nesting for associated invoices
}
