import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFreelancerDto {
    @IsNotEmpty()
    @IsNumber()
    user_id: number;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    experience?: string;

    @IsOptional()
    hourly_rate?: number;
}