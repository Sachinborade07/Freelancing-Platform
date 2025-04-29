import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from 'src/entities/client.entity';
import { CreateClientDto } from './dto/client.dto';
import { Users } from 'src/entities/users.entity';

@Injectable()
export class ClientsService {

    constructor(
        @InjectRepository(Client)
        private clientsRepository: Repository<Client>,
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
    ) { }

    async findByEmail(email: string): Promise<Client> {
        const client = await this.clientsRepository.findOne({
            where: {
                user: { email }
            },
            relations: ['user', 'projects']
        });
        if (!client) {
            throw new NotFoundException(`Client with email ${email} not found`);
        }
        return client;
    }

    async create(createClientDto: CreateClientDto): Promise<Client> {
        const user = await this.usersRepository.findOne({
            where: { user_id: createClientDto.user_id },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const client = this.clientsRepository.create({
            ...createClientDto,
            user,
        });
        return await this.clientsRepository.save(client);
    }

    async findAll(): Promise<Client[]> {
        return await this.clientsRepository.find({ relations: ['user', 'projects'] });
    }

    async findOne(id: number): Promise<Client> {
        const client = await this.clientsRepository.findOne({
            where: { client_id: id },
            relations: ['user', 'projects'],
        });
        if (!client) {
            throw new NotFoundException(`Client with ID ${id} not found`);
        }
        return client;
    }

    async update(id: number, updateClientDto: CreateClientDto): Promise<Client> {
        const client = await this.findOne(id);
        this.clientsRepository.merge(client, updateClientDto);
        return await this.clientsRepository.save(client);
    }

    async remove(id: number): Promise<void> {
        const result = await this.clientsRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Client with ID ${id} not found`);
        }
    }

    async findByUserId(userId: number): Promise<Client> {
        const client = await this.clientsRepository.findOne({ where: { user: { user_id: userId } }, relations: ['user'] });
        if (!client) {
            throw new NotFoundException(`Client with user ID ${userId} not found`);
        }
        return client;
    }

}