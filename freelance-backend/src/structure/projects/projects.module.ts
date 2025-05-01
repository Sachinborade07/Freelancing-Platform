import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/entities/project.entity';
import { Client } from 'src/entities/client.entity';
import { Freelancer } from 'src/entities/freelancer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      Client,
      Freelancer
    ]),
  ],
  providers: [ProjectsService],
  controllers: [ProjectsController],
  exports: [ProjectsService]
})
export class ProjectsModule { }
