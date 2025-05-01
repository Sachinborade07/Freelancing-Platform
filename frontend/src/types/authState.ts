import { LoginData } from "../api/auth/login";
import { RegisterData } from "../api/auth/register";
import { User } from "./user";

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    initialized: boolean;
    login: (data: LoginData) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    initialize: () => void;
}
