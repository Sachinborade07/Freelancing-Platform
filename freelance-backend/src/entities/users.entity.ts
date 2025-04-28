import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "./client.entity";
import { Freelancer } from "./freelancer.entity";
import { Message } from "./message.entity";

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column({ length: 50, unique: true })
    username: string;

    @Column({ length: 100, unique: true })
    email: string;

    @Column({ length: 255 })
    password_hash: string;

    @Column({ length: 15 })
    user_type: 'freelancer' | 'client';

    @OneToMany(() => Message, message => message.sender)
    sentMessages: Message[];

    @OneToMany(() => Message, message => message.receiver)
    receivedMessages: Message[];

    @OneToOne(() => Client, client => client.user)
    client: Client;

    @OneToOne(() => Freelancer, freelancer => freelancer.user)
    freelancer: Freelancer;
}