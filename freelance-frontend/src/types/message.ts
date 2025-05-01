import type { Project } from './Project';
import type { User } from './User';
// Define File type if needed, otherwise keep null or remove
// interface File {
//   file_id: number;
//   // other file properties
// }

export interface Message {
    message_id: number;
    project_id: number;
    sender_id: number;
    receiver_id: number;
    file_id: number | null; // ID of an attached file, or null
    content: string;
    sent_at: string; // ISO date string
    project?: Project; // Optional nesting
    sender?: User;     // Optional nesting
    receiver?: User;   // Optional nesting
    file?: any | null; // Optional nesting for File type or null
}
