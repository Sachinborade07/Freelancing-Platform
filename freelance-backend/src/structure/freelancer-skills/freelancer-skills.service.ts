import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FreelancerSkill } from 'src/entities/freelance-skill.entity';
import { CreateFreelancerSkillDto } from './dto/freelancer-skills.dto';
import { Freelancer } from 'src/entities/freelancer.entity';
import { Skill } from 'src/entities/skill.entity';

@Injectable()
export class FreelancerSkillsService {
    constructor(
        @InjectRepository(FreelancerSkill)
        private freelancerSkillsRepository: Repository<FreelancerSkill>,
        @InjectRepository(Freelancer)
        private freelancersRepository: Repository<Freelancer>,
        @InjectRepository(Skill)
        private skillsRepository: Repository<Skill>,
    ) { }

    async create(
        createFreelancerSkillDto: CreateFreelancerSkillDto,
    ): Promise<FreelancerSkill> {
        const freelancer = await this.freelancersRepository.findOne({
            where: { freelancer_id: createFreelancerSkillDto.freelancer_id },
        });
        if (!freelancer) {
            throw new NotFoundException('Freelancer not found');
        }

        const skill = await this.skillsRepository.findOne({
            where: { skill_id: createFreelancerSkillDto.skill_id },
        });
        if (!skill) {
            throw new NotFoundException('Skill not found');
        }

        const freelancerSkill = this.freelancerSkillsRepository.create({
            ...createFreelancerSkillDto,
            freelancer,
            skill,
        });
        return await this.freelancerSkillsRepository.save(freelancerSkill);
    }

    async findAll(): Promise<FreelancerSkill[]> {
        return await this.freelancerSkillsRepository.find({
            relations: ['freelancer', 'skill'],
        });
    }

    async findByFreelancer(freelancerId: number): Promise<FreelancerSkill[]> {
        return await this.freelancerSkillsRepository.find({
            where: { freelancer_id: freelancerId },
            relations: ['skill'],
        });
    }

    async findOne(id: number): Promise<FreelancerSkill> {
        const freelancerSkill = await this.freelancerSkillsRepository.findOne({
            where: { freelancer_skill_id: id },
            relations: ['freelancer', 'skill'],
        });
        if (!freelancerSkill) {
            throw new NotFoundException(`Freelancer skill with ID ${id} not found`);
        }
        return freelancerSkill;
    }

    async update(
        id: number,
        updateFreelancerSkillDto: CreateFreelancerSkillDto,
    ): Promise<FreelancerSkill> {
        const freelancerSkill = await this.findOne(id);
        this.freelancerSkillsRepository.merge(freelancerSkill, updateFreelancerSkillDto);
        return await this.freelancerSkillsRepository.save(freelancerSkill);
    }

    async remove(id: number): Promise<void> {
        const result = await this.freelancerSkillsRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Freelancer skill with ID ${id} not found`);
        }
    }
}