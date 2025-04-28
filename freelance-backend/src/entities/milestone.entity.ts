// src/milestones/entities/milestone.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from 'typeorm';
import { Project } from './project.entity';
import { Invoice } from './invoice.entity';

@Entity()
export class Milestone {
    @PrimaryGeneratedColumn()
    milestone_id: number;

    @Column()
    project_id: number;

    @Column({ length: 100 })
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'date', nullable: true })
    due_date: Date;

    @Column({ length: 20, default: 'pending' })
    status: string;

    @ManyToOne(() => Project, project => project.milestones)
    project: Project;

    @OneToOne(() => Invoice, invoice => invoice.milestone)
    invoice: Invoice;
}