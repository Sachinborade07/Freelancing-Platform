import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Repository } from 'typeorm';
import { Project } from 'src/entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Client } from 'src/entities/client.entity';
import { ProjectQueryDto } from './dto/query-project.dto';
import { Freelancer } from 'src/entities/freelancer.entity';


@Injectable()
export class ProjectsService {

    constructor(
        @InjectRepository(Freelancer)
        private freelancersRepository: Repository<Freelancer>,
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

    async findByClient(clientId: number): Promise<any[]> {
        return await this.projectsRepository
            .createQueryBuilder('project')
            .leftJoinAndSelect('project.client', 'client')
            .leftJoinAndSelect('project.freelancer', 'freelancer')
            .leftJoinAndSelect('freelancer.user', 'user')
            .leftJoinAndSelect('project.milestones', 'milestone')
            .leftJoinAndSelect('project.bids', 'bid')
            .leftJoinAndSelect('project.messages', 'message')
            .where('project.client_id = :clientId', { clientId })
            .orderBy('project.created_at', 'DESC')
            .select([
                'project.project_id',
                'project.title',
                'frelancer.freelancer_id',
                'freelancer.user_id',
                'user.username',
                'project.description',
                'project.budget',
                'project.status',
                'project.created_at',
                'project.deadline',
                'client.client_id',
                'client.company_name',
                'client.address',
                'milestone',
                'bid',
                'message'
            ])
            .getMany();
    }

    async findByFreelancer(freelancerId: number): Promise<Project[]> {
        return await this.projectsRepository
            .createQueryBuilder('project')
            .leftJoinAndSelect('project.client', 'client')
            .leftJoinAndSelect('project.freelancer', 'freelancer')
            .leftJoinAndSelect('project.milestones', 'milestone')
            .leftJoinAndSelect('project.bids', 'bid')
            .leftJoinAndSelect('project.messages', 'message')
            .where('project.freelancer_id = :freelancerId', { freelancerId })
            .orderBy('project.created_at', 'DESC')
            .select([
                'project.project_id',
                'project.title',
                'project.description',
                'project.budget',
                'project.status',
                'project.created_at',
                'project.deadline',
                'client.client_id',
                'client.company_name',
                'client.address',
                'freelancer.freelancer_id',
                'freelancer.user_id',
                'milestone',
                'bid',
                'message'
            ])
            .getMany();
    }

    async update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {

        const project = await this.projectsRepository.findOne({
            where: { project_id: id },
            relations: ['client', 'freelancer', 'milestones', 'bids', 'messages'],
        });

        if (!project) {
            throw new Error(`Project with ID ${id} not found`);
        }

        if (updateProjectDto.status) {
            project.status = updateProjectDto.status;
        }


        if (updateProjectDto.title) {
            project.title = updateProjectDto.title;
        }

        if (updateProjectDto.description) {
            project.description = updateProjectDto.description;
        }

        if (updateProjectDto.budget) {
            project.budget = updateProjectDto.budget;
        }

        if (updateProjectDto.freelancer_id !== undefined) {
            const freelancer = await this.freelancersRepository.findOneBy({
                freelancer_id: updateProjectDto.freelancer_id
            });
            if (!freelancer) {
                throw new NotFoundException(`Freelancer with ID ${updateProjectDto.freelancer_id} not found`);
            }
            project.freelancer = freelancer;
        }

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