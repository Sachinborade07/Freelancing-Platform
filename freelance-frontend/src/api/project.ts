import axios from 'axios';
import { CreateProjectData, Project } from '../types/Project';

const api = axios.create({ baseURL: 'http://localhost:3000' });

const project = {
    createProject: async (data: CreateProjectData, token: string): Promise<Project> => {
        const response = await api.post<Project>('/projects', data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    getProjects: async (token: string, params?: any): Promise<{ data: Project[]; count: number }> => {
        const response = await api.get<{ data: Project[]; count: number }>('/projects', {
            headers: { Authorization: `Bearer ${token}` },
            params,
        });
        return response.data;
    },

    getProjectById: async (id: number, token: string): Promise<Project> => {
        const response = await api.get<Project>(`/projects/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    getClientProjects: async (clientId: number, token: string): Promise<Project[]> => {
        const response = await api.get<Project[]>(`/projects/client/${clientId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    updateProject: async (id: number, update: Partial<Project>, token: string): Promise<Project> => {
        const response = await api.patch<Project>(`/projects/${id}`, update, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    updateProjectStatus: async (
        id: number,
        status: 'draft' | 'posted' | 'in_progress' | 'completed',
        token: string
    ): Promise<Project> => {
        const response = await api.patch<Project>(`/projects/${id}/status`, { status }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    deleteProject: async (id: number, token: string): Promise<void> => {
        await api.delete(`/projects/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    },
};

export default project;
