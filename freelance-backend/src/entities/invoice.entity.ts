import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Milestone } from './milestone.entity';

@Entity()
export class Invoice {
    @PrimaryGeneratedColumn()
    invoice_id: number;

    @Column()
    milestone_id: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({ length: 20, default: 'pending' })
    status: string;

    @Column({ type: 'date', nullable: true })
    paid_at: Date;

    @OneToOne(() => Milestone)
    @JoinColumn({ name: 'milestone_id' })
    milestone: Milestone;
}