import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum } from 'class-validator';

export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(8)
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEnum(['client', 'freelancer'])
    @IsNotEmpty()
    user_type: 'client' | 'freelancer';
}
