import { User } from "./User";

export default interface AuthContextType {
    user: User | null;
    token: string | null;
    //LOGIN
    login: (email: string, password: string) => Promise<void>
    //REGISTER
    register: (data: {
        email: string;
        password: string;
        username: string;
        user_type: 'client' | 'freelancer';
    }) => Promise<void>

    //LOGOUT
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;

}