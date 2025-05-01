import type { User } from './User';
import type { FreelancerSkill } from './freelancer-skill';
import type { Bid } from './bid';

export interface Freelancer {
    freelancer_id: number;
    user_id: number;
    bio: string | null; // Allow null
    experience: string | null; // Allow null
    hourly_rate: string | null; // Allow null, store as string if API returns it as such
    user: User;
    skills: FreelancerSkill[];
    bids: Bid[];
}
