import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateMessageDto {
    @IsNotEmpty()
    @IsNumber()
    project_id: number;

    @IsNotEmpty()
    @IsNumber()
    sender_id: number;

    @IsNotEmpty()
    @IsNumber()
    receiver_id: number;

    @IsOptional()
    @IsNumber()
    file_id?: number;

    @IsNotEmpty()
    @IsString()
    content: string;
}