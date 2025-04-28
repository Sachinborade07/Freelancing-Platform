import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Message } from './message.entity';
import { Freelancer } from './freelancer.entity';

@Entity()
export class File {
    @PrimaryGeneratedColumn()
    file_id: number;

    @Column()
    uploader_id: number;

    @Column()
    project_id: number;

    @Column({ length: 255 })
    file_name: string;

    @Column({ length: 50, nullable: true })
    file_type: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    uploaded_at: Date;

    @ManyToOne(() => Freelancer, freelancer => freelancer.files)
    uploader: Freelancer;

    @ManyToOne(() => Message, message => message.file)
    message: Message;
}