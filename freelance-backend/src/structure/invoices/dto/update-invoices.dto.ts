import { PartialType } from '@nestjs/mapped-types';
import { CreateInvoiceDto } from './create-invoice.dto';
import { IsOptional, IsString, IsDate } from 'class-validator';
import { IsValidInvoiceStatus } from 'src/validator/invoice-status.validator';

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {
    @IsOptional()
    @IsString()
    @IsValidInvoiceStatus(['pending', 'paid', 'cancelled'])
    status?: string;

    @IsOptional()
    @IsDate()
    paid_at?: Date;
}