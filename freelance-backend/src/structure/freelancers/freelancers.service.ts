import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Freelancer } from 'src/entities/freelancer.entity';
import { CreateFreelancerDto } from './dto/freelancer.dto';
import { Users } from 'src/entities/users.entity';

@Injectable()
export class FreelancersService {

    constructor(
        @InjectRepository(Freelancer)
        private freelancersRepository: Repository<Freelancer>,
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
    ) { }

    async findByEmail(email: string): Promise<Freelancer> {
        const freelancer = await this.freelancersRepository.findOne({
            where: {
                user: { email }
            },
            relations: ['user']
        });
        if (!freelancer) {
            throw new NotFoundException(`Freelancer with email ${email} not found`);
        }
        return freelancer;
    }

    async create(createFreelancerDto: CreateFreelancerDto): Promise<Freelancer> {
        const user = await this.usersRepository.findOne({
            where: { user_id: createFreelancerDto.user_id },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const freelancer = this.freelancersRepository.create({
            ...createFreelancerDto,
            user,
        });
        return await this.freelancersRepository.save(freelancer);
    }

    async findAll(): Promise<Freelancer[]> {
        return await this.freelancersRepository.find({
            relations: ['user', 'skills', 'bids'],
        });
    }

    async findOne(id: number): Promise<Freelancer> {
        const freelancer = await this.freelancersRepository.findOne({
            where: { freelancer_id: id },
            relations: ['user', 'skills', 'bids'],
        });
        if (!freelancer) {
            throw new NotFoundException(`Freelancer with ID ${id} not found`);
        }
        return freelancer;
    }

    async update(
        id: number,
        updateFreelancerDto: CreateFreelancerDto,
    ): Promise<Freelancer> {
        const freelancer = await this.findOne(id);
        this.freelancersRepository.merge(freelancer, updateFreelancerDto);
        return await this.freelancersRepository.save(freelancer);
    }

    async remove(id: number): Promise<void> {
        const result = await this.freelancersRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Freelancer with ID ${id} not found`);
        }
    }

    async findByUserId(userId: number): Promise<Freelancer> {
        const freelancer = await this.freelancersRepository.findOne({
            where: { user: { user_id: userId } },
            relations: ['user'],
        });
        if (!freelancer) {
            throw new NotFoundException(`Freelancer with user ID ${userId} not found`);
        }
        return freelancer;
    }
}