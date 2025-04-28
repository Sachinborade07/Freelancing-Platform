import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Milestone } from 'src/entities/milestone.entity';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { Project } from 'src/entities/project.entity';

@Injectable()
export class MilestonesService {
    constructor(
        @InjectRepository(Milestone)
        private milestonesRepository: Repository<Milestone>,
        @InjectRepository(Project)
        private projectsRepository: Repository<Project>,
    ) { }

    async create(createMilestoneDto: CreateMilestoneDto): Promise<Milestone> {
        const project = await this.projectsRepository.findOne({
            where: { project_id: createMilestoneDto.project_id },
        });
        if (!project) {
            throw new NotFoundException('Project not found');
        }

        const milestone = this.milestonesRepository.create({
            ...createMilestoneDto,
            project,
        });
        return await this.milestonesRepository.save(milestone);
    }

    async findAll(): Promise<Milestone[]> {
        return await this.milestonesRepository.find({ relations: ['project'] });
    }

    async findByProject(projectId: number): Promise<Milestone[]> {
        return await this.milestonesRepository.find({
            where: { project_id: projectId },
            relations: ['project'],
        });
    }

    async findOne(id: number): Promise<Milestone> {
        const milestone = await this.milestonesRepository.findOne({
            where: { milestone_id: id },
            relations: ['project', 'invoice'],
        });
        if (!milestone) {
            throw new NotFoundException(`Milestone with ID ${id} not found`);
        }
        return milestone;
    }

    async update(
        id: number,
        updateMilestoneDto: UpdateMilestoneDto,
    ): Promise<Milestone> {
        const milestone = await this.findOne(id);
        this.milestonesRepository.merge(milestone, updateMilestoneDto);
        return await this.milestonesRepository.save(milestone);
    }

    async updateStatus(id: number, status: string): Promise<Milestone> {
        const milestone = await this.findOne(id);
        milestone.status = status;
        return await this.milestonesRepository.save(milestone);
    }

    async remove(id: number): Promise<void> {
        const result = await this.milestonesRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Milestone with ID ${id} not found`);
        }
    }
}