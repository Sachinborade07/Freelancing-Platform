import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from 'src/entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { Project } from 'src/entities/project.entity';
import { Users } from 'src/entities/users.entity';
import { File } from 'src/entities/file.entity';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Message)
        private messagesRepository: Repository<Message>,
        @InjectRepository(Project)
        private projectsRepository: Repository<Project>,
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
        @InjectRepository(File)
        private filesRepository: Repository<File>,
    ) { }

    async create(createMessageDto: CreateMessageDto): Promise<Message> {
        const project = await this.projectsRepository.findOne({
            where: { project_id: createMessageDto.project_id },
        });
        if (!project) {
            throw new NotFoundException('Project not found');
        }

        const sender = await this.usersRepository.findOne({
            where: { user_id: createMessageDto.sender_id },
        });
        if (!sender) {
            throw new NotFoundException('Sender not found');
        }

        const receiver = await this.usersRepository.findOne({
            where: { user_id: createMessageDto.receiver_id },
        });
        if (!receiver) {
            throw new NotFoundException('Receiver not found');
        }

        let file: File | null = null;
        if (createMessageDto.file_id) {
            file = await this.filesRepository.findOne({
                where: { file_id: createMessageDto.file_id },
            });
            if (!file) {
                throw new NotFoundException('File not found');
            }
        }

        const message = this.messagesRepository.create({
            ...createMessageDto,
            project,
            sender,
            receiver,
            file: file || undefined,
        });
        return await this.messagesRepository.save(message);
    }

    async findAll(): Promise<Message[]> {
        return await this.messagesRepository.find({
            relations: ['project', 'sender', 'receiver', 'file'],
        });
    }

    async findByProject(projectId: number): Promise<Message[]> {
        return await this.messagesRepository.find({
            where: { project_id: projectId },
            relations: ['sender', 'receiver', 'file'],
            order: { sent_at: 'ASC' },
        });
    }

    async findOne(id: number): Promise<Message> {
        const message = await this.messagesRepository.findOne({
            where: { message_id: id },
            relations: ['project', 'sender', 'receiver', 'file'],
        });
        if (!message) {
            throw new NotFoundException(`Message with ID ${id} not found`);
        }
        return message;
    }

    async update(id: number, updateMessageDto: UpdateMessageDto, userId: number): Promise<Message> {
        const message = await this.messagesRepository.findOne({
            where: { message_id: id },
            relations: ['sender'],
        });

        if (!message) {
            throw new NotFoundException(`Message with ID ${id} not found`);
        }

        if (message.sender.user_id !== userId) {
            throw new ForbiddenException('You can only update your own messages');
        }

        if (updateMessageDto.content) {
            message.content = updateMessageDto.content;
        }

        return await this.messagesRepository.save(message);
    }

    async remove(id: number, userId: number): Promise<void> {
        const message = await this.messagesRepository.findOne({
            where: { message_id: id },
            relations: ['sender'],
        });

        if (!message) {
            throw new NotFoundException(`Message with ID ${id} not found`);
        }

        if (message.sender.user_id !== userId) {
            throw new ForbiddenException('You can only delete your own messages');
        }

        await this.messagesRepository.remove(message);
    }
}