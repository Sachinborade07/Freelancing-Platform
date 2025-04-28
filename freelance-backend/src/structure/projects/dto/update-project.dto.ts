import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { IsOptional, IsString } from 'class-validator';
import { IsValidProjectStatus } from 'src/validator/project-status.validator';


export class UpdateProjectDto extends PartialType(CreateProjectDto) {
    @IsOptional()
    @IsString()
    @IsValidProjectStatus(['draft', 'posted', 'in_progress', 'completed', 'cancelled'])
    status?: string;
}