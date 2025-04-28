import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Freelancer } from './freelancer.entity';
import { Skill } from './skill.entity';

@Entity()
export class FreelancerSkill {
    @PrimaryGeneratedColumn()
    freelancer_skill_id: number;

    @Column()
    freelancer_id: number;

    @Column()
    skill_id: number;

    @Column({ length: 20 })
    proficiency_level: string;

    @ManyToOne(() => Freelancer, freelancer => freelancer.skills)
    freelancer: Freelancer;

    @ManyToOne(() => Skill, skill => skill.freelancerSkills)
    skill: Skill;
}