import { Project } from "../api/project/project";
import { Invoice } from "./invoice";


export interface Milestone {
    milestone_id: number;
    project_id: number;
    title: string;
    description: string;
    due_date: string;
    status: 'pending' | 'in_progress' | 'completed' | 'overdue';
    project?: Project;
    invoices?: Invoice[];
}