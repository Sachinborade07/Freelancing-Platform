import axios from 'axios';
import { Bid, CreateBidData } from '../types/bid';

const api = axios.create({ baseURL: 'http://localhost:3000' });

const bid = {
    createBid: async (data: CreateBidData, token: string): Promise<Bid> => {
        const response = await api.post<Bid>('/bids', data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    getBidsForProject: async (projectId: number, token: string): Promise<Bid[]> => {
        const response = await api.get<Bid[]>(`/bids/project/${projectId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    getBidsByFreelancer: async (freelancerId: number, token: string): Promise<Bid[]> => {
        const response = await api.get<Bid[]>(`/bids/freelancer/${freelancerId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    updateBidStatus: async (
        bidId: number,
        status: 'accepted' | 'rejected',
        token: string
    ): Promise<Bid> => {
        const response = await api.patch<Bid>(`/bids/${bidId}/status`, { status }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },
};

export default bid;
