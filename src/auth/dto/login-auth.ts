import { IsNotEmpty, IsEmail } from 'class-validator';

export class LoginAuthDto {
    @IsNotEmpty({ message: 'Email harus diisi' })
    @IsEmail({}, { message: 'Format email tidak valid' })
    readonly email: string;

    @IsNotEmpty({ message: 'Password harus diisi' })
    readonly password: string;
}