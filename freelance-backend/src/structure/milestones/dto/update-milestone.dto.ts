import { PartialType } from '@nestjs/mapped-types';
import { CreateMilestoneDto } from './create-milestone.dto';
import { IsOptional, IsString } from 'class-validator';
import { IsValidMilestoneStatus } from 'src/validator/milestone-status.validator';

export class UpdateMilestoneDto extends PartialType(CreateMilestoneDto) {
    @IsOptional()
    @IsString()
    @IsValidMilestoneStatus(['pending', 'achieved'])
    status?: string;
}