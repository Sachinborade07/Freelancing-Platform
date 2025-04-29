import { PartialType } from '@nestjs/mapped-types';
import { CreateMilestoneDto } from './create-milestone.dto';
import { IsOptional, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsValidMilestoneStatus } from 'src/validator/milestone-status.validator';

export class UpdateMilestoneDto extends PartialType(CreateMilestoneDto) {
    @IsOptional()
    @IsString()
    @IsValidMilestoneStatus(['pending', 'achieved'])
    status?: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    due_date?: Date;
}
