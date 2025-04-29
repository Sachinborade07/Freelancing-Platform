import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bid } from 'src/entities/bid.entity';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { Project } from 'src/entities/project.entity';
import { Freelancer } from 'src/entities/freelancer.entity';

@Injectable()
export class BidsService {
    constructor(
        @InjectRepository(Bid)
        private bidsRepository: Repository<Bid>,
        @InjectRepository(Project)
        private projectsRepository: Repository<Project>,
        @InjectRepository(Freelancer)
        private freelancersRepository: Repository<Freelancer>,
    ) { }

    async create(createBidDto: CreateBidDto): Promise<Bid> {
        const project = await this.projectsRepository.findOne({
            where: { project_id: createBidDto.project_id },
        });
        if (!project) {
            throw new NotFoundException('Project not found');
        }

        const freelancer = await this.freelancersRepository.findOne({
            where: { freelancer_id: createBidDto.freelancer_id },
        });
        if (!freelancer) {
            throw new NotFoundException('Freelancer not found');
        }

        const bid = this.bidsRepository.create({
            ...createBidDto,
            bid_amount: Number(createBidDto.bid_amount),
            project,
            freelancer,
        });
        return await this.bidsRepository.save(bid);
    }

    async findAll(): Promise<Bid[]> {
        return await this.bidsRepository.find({
            relations: ['project', 'freelancer'],
        });
    }

    async findByProject(projectId: number): Promise<Bid[]> {
        return await this.bidsRepository.find({
            where: { project_id: projectId },
            relations: ['freelancer'],
        });
    }

    async findByFreelancer(freelancerId: number): Promise<Bid[]> {
        return await this.bidsRepository.find({
            where: { freelancer_id: freelancerId },
            relations: ['project'],
        });
    }

    async findOne(id: number): Promise<Bid> {
        const bid = await this.bidsRepository.findOne({
            where: { bid_id: id },
            relations: ['project', 'freelancer'],
        });
        if (!bid) {
            throw new NotFoundException(`Bid with ID ${id} not found`);
        }
        return bid;
    }

    async update(id: number, updateBidDto: UpdateBidDto): Promise<Bid> {
        const bid = await this.findOne(id);
        this.bidsRepository.merge(bid, {
            ...updateBidDto,
            bid_amount: updateBidDto.bid_amount ? Number(updateBidDto.bid_amount) : undefined,
        });
        return await this.bidsRepository.save(bid);
    }

    async updateStatus(id: number, status: string): Promise<Bid> {
        const bid = await this.findOne(id);
        bid.status = status;
        return await this.bidsRepository.save(bid);
    }

    async remove(id: number): Promise<void> {
        const result = await this.bidsRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Bid with ID ${id} not found`);
        }
    }
}