import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/structure/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/entities/users.entity';
import { JwtPayload } from './strategies/jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<Users | null> {
        const users = await this.usersService.findByEmail(email);
        if (!users || !(await bcrypt.compare(password, users.password_hash))) {
            return null;
        }

        const { password_hash, ...result } = users;
        return { ...result, password_hash: undefined } as unknown as Users;
    }

    async register(registerDto: RegisterDto): Promise<{ access_token: string; user: Users }> {
        const hashedPassword = await bcrypt.hash(registerDto.password, 8);
        const users = await this.usersService.create({
            ...registerDto,
            password_hash: hashedPassword,
        });

        const { password_hash, ...result } = users;
        return this.login({
            email: registerDto.email,
            password: registerDto.password,
        });
    }

    async login(loginDto: LoginDto): Promise<{ access_token: string; user: Users }> {
        const { email, password } = loginDto;

        const user = await this.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload: JwtPayload = {
            email: user.email,
            sub: user.user_id,
            user_type: user.user_type,
        };

        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }
}
