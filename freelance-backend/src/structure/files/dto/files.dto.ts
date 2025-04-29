import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateFileDto {
    @IsNotEmpty()
    @IsNumber()
    uploader_id: string;

    @IsNotEmpty()
    @IsNumber()
    project_id: string;

    @IsNotEmpty()
    @IsString()
    file_name: string;

    @IsString()
    file_type?: string;
}