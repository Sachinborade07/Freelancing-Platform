import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from 'src/entities/file.entity';
import { CreateFileDto } from './dto/files.dto';
import { Users } from 'src/entities/users.entity';
import { Project } from 'src/entities/project.entity';

@Injectable()
export class FilesService {
    constructor(
        @InjectRepository(File)
        private filesRepository: Repository<File>,
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
        @InjectRepository(Project)
        private projectsRepository: Repository<Project>,
    ) { }

    async create(createFileDto: CreateFileDto): Promise<File> {
        const uploader = await this.usersRepository.findOne({
            where: { user_id: createFileDto.uploader_id },
        });
        if (!uploader) {
            throw new NotFoundException('Uploader not found');
        }

        const project = await this.projectsRepository.findOne({
            where: { project_id: createFileDto.project_id },
        });
        if (!project) {
            throw new NotFoundException('Project not found');
        }

        const file = this.filesRepository.create({
            ...createFileDto,
            uploader_id: uploader.user_id,
            project_id: project.project_id,
        });
        return await this.filesRepository.save(file);
    }

    async findAll(): Promise<File[]> {
        return await this.filesRepository.find({
            relations: ['uploader', 'project'],
        });
    }

    async findByProject(projectId: number): Promise<File[]> {
        return await this.filesRepository.find({
            where: { project_id: projectId },
            relations: ['uploader'],
        });
    }

    async findOne(id: number): Promise<File> {
        const file = await this.filesRepository.findOne({
            where: { file_id: id },
            relations: ['uploader', 'project'],
        });
        if (!file) {
            throw new NotFoundException(`File with ID ${id} not found`);
        }
        return file;
    }

    async remove(id: number): Promise<void> {
        const result = await this.filesRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`File with ID ${id} not found`);
        }
    }
}