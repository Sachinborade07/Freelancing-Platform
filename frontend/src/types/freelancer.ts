import { User } from './user';
import type { FreelancerSkill } from './freelancer-skill';
import type { Bid } from '../api/bid/bid';

export interface Freelancer {
    freelancer_id: number;
    user_id: number;
    bio: string | null;
    experience: string | null;
    hourly_rate: string | null;
    user: User;
    skills: FreelancerSkill[];
    bids: Bid[];
}
