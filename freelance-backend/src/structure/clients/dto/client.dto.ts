import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateClientDto {
    @IsNotEmpty()
    @IsNumber()
    user_id: number;

    company_name?: string;
    address?: string;
}