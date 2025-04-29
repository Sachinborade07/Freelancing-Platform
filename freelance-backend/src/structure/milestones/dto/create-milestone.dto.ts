import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, IsDate, IsOptional } from 'class-validator';
import { IsValidMilestoneStatus } from 'src/validator/milestone-status.validator';

export class CreateMilestoneDto {
    @IsNotEmpty()
    @IsNumber()
    project_id: number;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsString()
    description: string;


    @Type(() => Date)
    @IsDate()
    due_date?: Date;

    @IsString()
    @IsValidMilestoneStatus(['pending'])
    status: string;
}