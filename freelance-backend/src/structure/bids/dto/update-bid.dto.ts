import { PartialType } from '@nestjs/mapped-types';
import { CreateBidDto } from './create-bid.dto';
import { IsOptional, IsString } from 'class-validator';
import { IsValidProjectStatus } from 'src/validator/project-status.validator';

export class UpdateBidDto extends PartialType(CreateBidDto) {
    @IsOptional()
    @IsString()
    @IsValidProjectStatus(['submitted', 'accepted', 'rejected', 'withdrawn'])
    status?: string;
}