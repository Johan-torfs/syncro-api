import { Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private jwtService: JwtService) { }

    async validateUser(userLoginDto: UserLoginDto): Promise<any> {
        const user = await this.usersService.findOneValidate(userLoginDto);
        if (!user) return null;

        const passwordValid = await bcrypt.compare(userLoginDto.password, user.password)
        if (!passwordValid) return null;

        return user;
    }

    async login(user: User) {
        const payload = { email: user.email, id: user.id };
        return {
        user: payload,
        access_token: this.jwtService.sign(payload),
        };
    }

    async register(userRegisterDto: UserRegisterDto) {
        const user = await this.usersService.findOneValidate(userRegisterDto);
        if (user) throw new NotAcceptableException('User already exists');

        this.usersService.register(userRegisterDto);
    }
}
