import {
    IsNotEmpty,
    IsNumber,
    IsString,
    Min,
    IsOptional,
    IsDateString,
    IsEnum,
} from 'class-validator';
import { IsValidProjectStatus } from 'src/validator/project-status.validator';

export class CreateProjectDto {
    @IsNotEmpty()
    @IsNumber()
    client_id: number;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    budget: number;

    @IsNotEmpty()
    @IsValidProjectStatus(['draft', 'posted', 'in_progress', 'completed', 'cancelled'])
    status: string;

    @IsNotEmpty()
    @IsDateString()
    deadline: string;
}
