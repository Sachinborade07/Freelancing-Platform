import { IsNotEmpty, IsNumber, IsString, IsDate, IsOptional } from 'class-validator';
import { IsValidMilestoneStatus } from 'src/validator/milestone-status.validator';

export class CreateMilestoneDto {
    @IsNotEmpty()
    @IsNumber()
    project_id: number;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsDate()
    due_date?: Date;

    @IsOptional()
    @IsString()
    @IsValidMilestoneStatus(['pending'])
    status?: string;
}