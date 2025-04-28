import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/structure/users/users.service';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/entities/users.entity';
import { CreateUserDto } from 'src/structure/users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<Omit<Users, 'password_hash'>> {
        const users = await this.usersService.findByEmail(email);
        if (!users || !(await bcrypt.compare(pass, users.password_hash))) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const { password_hash, ...result } = users;
        return result;
    }

    async login(users: Users) {
        const payload = { email: users.email, sub: users.user_id, user_type: users.user_type };
        return {
            access_token: this.jwtService.sign(payload),
            users,
        };
    }

    async register(createUserDto: CreateUserDto): Promise<Users> {
        const hashedPassword = await bcrypt.hash(createUserDto.password_hash, 10);
        const users = await this.usersService.create({
            ...createUserDto,
            password_hash: hashedPassword,
        });
        const { password_hash, ...result } = users;
        return users;
    }
}