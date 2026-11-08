import {
    CanActivate, ExecutionContext, Injectable, UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from './public-decorator.js';

// Guard = penjaga pintu yang berjalan SEBELUM controller dijalankan
@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // endpoint bertanda @Public() langsung diloloskan
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) return true;

        // ambil token dari header "Authorization: Bearer <token>"
        const request = context.switchToHttp().getRequest();
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        if (type !== 'Bearer' || !token) {
            throw new UnauthorizedException('Token tidak ditemukan, silakan login');
        }

        try {
            // cek tanda tangan dan masa berlaku token
            request.user = await this.jwtService.verifyAsync(token);
        } catch {
            throw new UnauthorizedException('Token tidak valid atau sudah kedaluwarsa');
        }
        return true;
    }
}