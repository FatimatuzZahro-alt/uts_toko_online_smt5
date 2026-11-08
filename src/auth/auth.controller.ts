import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterAuthDto } from './dto/register-auth.js';
import { LoginAuthDto } from './dto/login-auth.js';
import { Public } from './public-decorator.js';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public() // boleh diakses tanpa token
    @Post('register')
    register(@Body() dto: RegisterAuthDto) {
        return this.authService.register(dto);
    }

    @Public()
    @Post('login')
    login(@Body() dto: LoginAuthDto) {
        return this.authService.login(dto);
    }
}