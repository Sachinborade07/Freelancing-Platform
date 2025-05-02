import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { IsValidProjectStatus } from 'src/validator/project-status.validator';


export class UpdateProjectDto extends PartialType(CreateProjectDto) {
    @IsOptional()
    @IsString()
    @IsValidProjectStatus(['draft', 'posted', 'in_progress', 'completed', 'cancelled'])
    status?: string;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    budget?: number;

    @IsOptional()
    @IsString()
    deadline?: string;

    @IsOptional()
    @IsNumber()
    freelancer_id?: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    files?: string[];
}