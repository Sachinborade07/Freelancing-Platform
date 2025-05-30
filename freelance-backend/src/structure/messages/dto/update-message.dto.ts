import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageDto } from './create-message.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateMessageDto extends PartialType(CreateMessageDto) {
    @IsOptional()
    @IsString()
    content?: string;
}