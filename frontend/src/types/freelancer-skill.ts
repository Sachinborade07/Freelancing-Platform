import type { Freelancer } from './freelancer';
import { Skill } from './skills';

export interface FreelancerSkill {
    freelancer_skill_id: number;
    freelancer_id: number;
    skill_id: number;
    proficiency_level: 'beginner' | 'intermediate' | 'expert';
    freelancer: Freelancer;
    skill: Skill;
}
