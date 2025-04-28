import { IsEmail, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class LoginDto {
    @IsEmail()
    @Type(() => String)
    email: string;

    @IsString()
    @Type(() => String)
    password: string;

    @IsIn(['client', 'freelancer'])
    @Type(() => String)
    role: 'client' | 'freelancer';
}
