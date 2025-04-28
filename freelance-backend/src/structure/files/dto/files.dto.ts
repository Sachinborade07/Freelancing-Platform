import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateFileDto {
    @IsNotEmpty()
    @IsNumber()
    uploader_id: number;

    @IsNotEmpty()
    @IsNumber()
    project_id: number;

    @IsNotEmpty()
    @IsString()
    file_name: string;

    @IsString()
    file_type?: string;
}