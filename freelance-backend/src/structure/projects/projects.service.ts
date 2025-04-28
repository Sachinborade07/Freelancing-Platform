import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Repository } from 'typeorm';
import { Project } from 'src/entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Client } from 'src/entities/client.entity';
import { ProjectQueryDto } from './dto/query-project.dto';


@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project)
        private projectsRepository: Repository<Project>,
        @InjectRepository(Client)
        private clientsRepository: Repository<Client>,
    ) { }

    async create(createProjectDto: CreateProjectDto): Promise<Project> {
        const client = await this.clientsRepository.findOne({
            where: { client_id: createProjectDto.client_id },
        });
        if (!client) {
            throw new NotFoundException('Client not found');
        }

        const project = this.projectsRepository.create({
            ...createProjectDto,
            client,
        });
        return await this.projectsRepository.save(project);
    }

    async findOne(id: number): Promise<Project> {
        const project = await this.projectsRepository.findOne({
            where: { project_id: id },
            relations: ['client', 'milestones', 'bids', 'files', 'messages'],
        });
        if (!project) {
            throw new NotFoundException(`Project with ID ${id} not found`);
        }
        return project;
    }

    async findAll(query: ProjectQueryDto): Promise<{ data: Project[]; count: number }> {
        const { page, limit, search, sortBy, sortOrder, status, minBudget, maxBudget, } = query;

        const where: any = {};

        if (search) {
            where.title = Like(`%${search}%`);
        }

        if (status) {
            where.status = status;
        }

        if (minBudget !== undefined || maxBudget !== undefined) {
            where.budget = Between(
                minBudget !== undefined ? minBudget : 0,
                maxBudget !== undefined ? maxBudget : Number.MAX_SAFE_INTEGER,
            );
        }

        const [data, count] = await this.projectsRepository.findAndCount({
            where,
            relations: ['client'],
            order: {
                ...(sortBy ? { [sortBy]: (sortOrder ?? 'ASC').toUpperCase() } : {}),
            },
            skip: ((page ?? 1) - 1) * (limit ?? 10),
            take: limit,
        });

        return { data, count };
    }



    async findByClient(clientId: number): Promise<Project[]> {
        return await this.projectsRepository.find({
            where: { client_id: clientId },
            relations: ['milestones', 'bids'],
        });
    }

    async update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
        const project = await this.findOne(id);
        this.projectsRepository.merge(project, updateProjectDto);
        return await this.projectsRepository.save(project);
    }

    async updateStatus(id: number, status: string): Promise<Project> {
        const project = await this.findOne(id);
        project.status = status;
        return await this.projectsRepository.save(project);
    }

    async remove(id: number): Promise<void> {
        const result = await this.projectsRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Project with ID ${id} not found`);
        }
    }
}