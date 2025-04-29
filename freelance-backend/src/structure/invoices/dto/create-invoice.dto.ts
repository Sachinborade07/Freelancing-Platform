import { IsNotEmpty, IsNumber, IsDecimal, Min, IsString } from 'class-validator';
import { IsValidInvoiceStatus } from 'src/validator/invoice-status.validator';

export class CreateInvoiceDto {
    @IsNotEmpty()
    @IsNumber()
    milestone_id: number;

    @IsNotEmpty()
    @IsDecimal()
    amount: string;

    @IsNotEmpty()
    @IsString()
    @IsValidInvoiceStatus(['pending'])
    status: string;
}