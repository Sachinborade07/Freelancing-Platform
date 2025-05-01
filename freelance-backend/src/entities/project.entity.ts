import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Client } from './client.entity';
import { Milestone } from './milestone.entity';
import { Bid } from './bid.entity';
import { Message } from './message.entity';
import { Freelancer } from './freelancer.entity';


@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    project_id: number;

    @Column()
    client_id: number;

    @Column({ nullable: true })
    freelancer_id: number;

    @Column({ length: 100 })
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
    budget: number;

    @Column({ length: 20, default: 'draft' })
    status: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'date' })
    deadline: Date;

    @ManyToOne(() => Client, client => client.projects)
    client: Client;

    @ManyToOne(() => Freelancer, freelancer => freelancer.projects)
    freelancer: Freelancer;

    @OneToMany(() => Milestone, milestone => milestone.project)
    milestones: Milestone[];

    @OneToMany(() => Bid, bid => bid.project)
    bids: Bid[];

    @OneToMany(() => Message, message => message.project)
    messages: Message[];
}