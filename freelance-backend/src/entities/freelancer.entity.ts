import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Users } from './users.entity';
import { FreelancerSkill } from './freelance-skill.entity';
import { Bid } from './bid.entity';


@Entity()
export class Freelancer {
    @PrimaryGeneratedColumn()
    freelancer_id: number;

    @Column()
    user_id: number;

    @Column({ type: 'text', nullable: true })
    bio: string;

    @Column({ type: 'text', nullable: true })
    experience: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    hourly_rate: number;

    @OneToOne(() => Users)
    @JoinColumn({ name: 'user_id' })
    user: Users;

    @OneToMany(() => FreelancerSkill, freelancerSkill => freelancerSkill.freelancer)
    skills: FreelancerSkill[];

    @OneToMany(() => Bid, bid => bid.freelancer)
    bids: Bid[];
    files: any;
}