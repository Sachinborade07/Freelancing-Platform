import type { User } from './User';
import type { Project } from './Project';

export interface Client {
    client_id: number;
    user_id: number;
    company_name: string | null; // Allow null for company_name
    address: string | null;      // Allow null for address
    user: User;
    projects: Project[]; // Array of projects associated with the client
}
