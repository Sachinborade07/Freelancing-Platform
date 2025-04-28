import { IsNotEmpty, IsNumber, IsString, IsDecimal, IsDate, Min, IsOptional } from 'class-validator';
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
    description?: string;

    @IsOptional()
    @IsDecimal()
    @Min(0)
    budget?: number;

    @IsOptional()
    @IsString()
    @IsValidProjectStatus(['draft'])
    status?: string;

    @IsNotEmpty()
    @IsDate()
    deadline: Date;
}