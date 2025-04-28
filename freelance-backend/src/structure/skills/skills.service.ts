import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from 'src/entities/skill.entity';
import { CreateSkillDto } from './dto/skills.dto';

@Injectable()
export class SkillsService {
    constructor(
        @InjectRepository(Skill)
        private skillsRepository: Repository<Skill>,
    ) { }

    async create(createSkillDto: CreateSkillDto): Promise<Skill> {
        const skill = this.skillsRepository.create(createSkillDto);
        return await this.skillsRepository.save(skill);
    }

    async findAll(): Promise<Skill[]> {
        return await this.skillsRepository.find();
    }

    async findOne(id: number): Promise<Skill> {
        const skill = await this.skillsRepository.findOne({ where: { skill_id: id } });
        if (!skill) {
            throw new NotFoundException(`Skill with ID ${id} not found`);
        }
        return skill;
    }

    async findByName(name: string): Promise<Skill> {
        const skill = await this.skillsRepository.findOne({ where: { name } });
        if (!skill) {
            throw new NotFoundException(`Skill with name ${name} not found`);
        }
        return skill;
    }

    async update(id: number, updateSkillDto: CreateSkillDto): Promise<Skill> {
        const skill = await this.findOne(id);
        this.skillsRepository.merge(skill, updateSkillDto);
        return await this.skillsRepository.save(skill);
    }

    async remove(id: number): Promise<void> {
        const result = await this.skillsRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Skill with ID ${id} not found`);
        }
    }
}