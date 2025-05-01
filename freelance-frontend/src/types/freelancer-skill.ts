import type { Freelancer } from './freelancer';
import type { Skill } from './skill';

export interface FreelancerSkill {
    freelancer_skill_id: number;
    freelancer_id: number;
    skill_id: number;
    proficiency_level: 'beginner' | 'intermediate' | 'expert'; // Define possible levels
    freelancer: Freelancer; // Optional nesting if needed, adjust based on API response structure
    skill: Skill;           // Optional nesting if needed
}
