import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from './project.entity';
import { Users } from './users.entity';
import { File } from './file.entity';

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    message_id: number;

    @Column()
    project_id: number;

    @Column()
    sender_id: number;

    @Column()
    receiver_id: number;

    @Column({ nullable: true })
    file_id: number;

    @Column({ type: 'text' })
    content: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    sent_at: Date;

    @ManyToOne(() => Project, project => project.messages)
    project: Project;

    @ManyToOne(() => Users, user => user.sentMessages)
    sender: Users;

    @ManyToOne(() => Users, user => user.receivedMessages)
    receiver: Users;

    @ManyToOne(() => File, file => file.message)
    file: File;

}