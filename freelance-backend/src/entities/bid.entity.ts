import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Project } from './project.entity';
import { Freelancer } from './freelancer.entity';

@Entity()
export class Bid {
    @PrimaryGeneratedColumn()
    bid_id: number;

    @Column()
    project_id: number;

    @Column()
    freelancer_id: number;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    bid_amount: number;

    @Column({ type: 'text' })
    proposal: string;

    @Column({ length: 20, default: 'submitted' })
    status: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    submitted_at: Date;

    @ManyToOne(() => Project, project => project.bids)
    project: Project;

    @ManyToOne(() => Freelancer, freelancer => freelancer.bids)
    freelancer: Freelancer;
}