export interface Message {
    message_id: number;
    project_id: number;
    sender_id: number;
    receiver_id: number | null;
    content: string;
    sent_at: string;
    sender?: {
        user_id: number;
        username: string;
        user_type: 'client' | 'freelancer';
    };
    receiver?: {
        user_id: number;
        username: string;
    } | null;
}
