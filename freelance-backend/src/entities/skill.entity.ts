import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { FreelancerSkill } from './freelance-skill.entity';

@Entity()
export class Skill {
    @PrimaryGeneratedColumn()
    skill_id: number;

    @Column({ length: 50, unique: true })
    name: string;

    @OneToMany(() => FreelancerSkill, freelancerSkill => freelancerSkill.skill)
    freelancerSkills: FreelancerSkill[];
}