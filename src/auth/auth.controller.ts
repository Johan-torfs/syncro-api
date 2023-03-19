import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserRegisterDto } from './dto/user-register.dto';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @Post('register')
    async register(@Body() userRegisterDto: UserRegisterDto) {
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(userRegisterDto.password, saltOrRounds);
        userRegisterDto.password = hashedPassword;
        return this.authService.register(userRegisterDto);
    }
}