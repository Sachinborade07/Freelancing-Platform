import { IsOptional, IsNumber, IsString, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class ProjectQueryDto {
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    page?: number = 1;

    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    limit?: number = 10;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    @IsIn(['title', 'status', 'created_at', 'deadline'])
    sortBy?: string = 'created_at';

    @IsOptional()
    @IsString()
    @IsIn(['asc', 'desc'])
    sortOrder?: string = 'desc';

    @IsOptional()
    @IsString()
    @IsIn(['draft', 'posted', 'in_progress', 'completed', 'cancelled'])
    status?: string;

    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    minBudget?: number;

    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    maxBudget?: number;
}