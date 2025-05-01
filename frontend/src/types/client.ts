
import { Project } from "../api/project/project";
import { User } from "./user";

export interface Client {
    client_id: number;
    user_id: number;
    company_name: string | null;
    address: string | null;
    user: User;
    projects: Project[];
}
