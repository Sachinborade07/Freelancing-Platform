import { Module } from '@nestjs/common';
import { FreelancerSkillsService } from './freelancer-skills.service';
import { FreelancerSkillsController } from './freelancer-skills.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreelancerSkill } from 'src/entities/freelance-skill.entity';
import { Freelancer } from 'src/entities/freelancer.entity';
import { Skill } from 'src/entities/skill.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FreelancerSkill,
      Freelancer,
      Skill,
    ]),
  ],
  providers: [FreelancerSkillsService],
  controllers: [FreelancerSkillsController],
  exports: [FreelancerSkillsService]
})
export class FreelancerSkillsModule { }
