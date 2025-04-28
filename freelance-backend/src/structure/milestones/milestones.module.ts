import { Module } from '@nestjs/common';
import { MilestonesService } from './milestones.service';
import { MilestonesController } from './milestones.controller';
import { Project } from 'src/entities/project.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Milestone } from 'src/entities/milestone.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Milestone,
      Project,
    ]),
  ],
  providers: [MilestonesService],
  controllers: [MilestonesController],
  exports: [MilestonesService]
})
export class MilestonesModule { }
