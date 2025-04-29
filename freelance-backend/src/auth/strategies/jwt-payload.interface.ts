export interface JwtPayload {
    email: string;
    sub: number;
    user_type: 'client' | 'freelancer';
}
