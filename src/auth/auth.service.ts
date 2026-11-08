import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { User } from './entity/entity-users.js';
import { RegisterAuthDto } from './dto/register-auth.js';
import { LoginAuthDto } from './dto/login-auth.js';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

    async register(dto: RegisterAuthDto) {
        // password tidak pernah disimpan asli, hanya hash-nya
        const hashed = await bcrypt.hash(dto.password, 10);
        const user = this.userRepository.create({
            name: dto.name,
            email: dto.email,
            password: hashed,
        });

        try {
            const saved = await this.userRepository.save(user);
            // password tidak ikut dikembalikan
            return { id: saved.id, name: saved.name, email: saved.email };
        } catch (error: any) {
            // 23505 = pelanggaran unique (email sudah ada)
            if (error?.code === '23505' || error?.driverError?.code === '23505') {
                throw new ConflictException('Email sudah terdaftar, gunakan email lain');
            }
            throw error;
        }
    }

    async login(dto: LoginAuthDto) {
        // password harus diambil eksplisit karena kolomnya select: false
        const user = await this.userRepository.findOne({
            where: { email: dto.email },
            select: { id: true, name: true, email: true, password: true },
        });

        // pesan sengaja sama untuk email salah dan password salah,
        // supaya orang tidak bisa menebak email mana yang terdaftar
        const valid = user && (await bcrypt.compare(dto.password, user.password));
        if (!user || !valid) {
            throw new UnauthorizedException('Email atau password salah');
        }

        // isi token: sub = id user, plus email
        const payload = { sub: user.id, email: user.email };
        return {
            accessToken: await this.jwtService.signAsync(payload),
            user: { id: user.id, name: user.name, email: user.email },
        };
    }
}