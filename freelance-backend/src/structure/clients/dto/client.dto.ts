import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateClientDto {
    @IsNotEmpty()
    @IsNumber()
    user_id: number;

    @IsString()
    company_name: string;

    @IsString()
    address: string;
}