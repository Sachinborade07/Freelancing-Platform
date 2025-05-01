import { Project } from '../api/project/project';
import { User } from './user';

export interface Message {
    message_id: number;
    project_id: number;
    sender_id: number;
    receiver_id: number;
    file_id: number | null;
    content: string;
    sent_at: string;
    project?: Project;
    sender?: User;
    receiver?: User;
    file?: any | null;
}
