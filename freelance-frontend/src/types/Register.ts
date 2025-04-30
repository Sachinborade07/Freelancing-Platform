export interface RegisterData {
    email: string;
    password: string;
    username: string;
    user_type: 'client' | 'freelancer';
}