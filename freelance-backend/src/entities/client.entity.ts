import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Users } from './users.entity';
import { Project } from './project.entity';

@Entity()
export class Client {
    @PrimaryGeneratedColumn()
    client_id: number;

    @Column()
    user_id: number;

    @Column({ length: 100 })
    company_name: string;

    @Column({ type: 'text' })
    address: string;

    @OneToOne(() => Users)
    @JoinColumn({ name: 'user_id' })
    user: Users;

    @OneToMany(() => Project, project => project.client)
    projects: Project[];
}