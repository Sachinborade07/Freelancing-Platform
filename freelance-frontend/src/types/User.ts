export interface User {
    user_id: number;
    email: string;
    username: string;
    user_type: 'client' | 'freelancer';
}