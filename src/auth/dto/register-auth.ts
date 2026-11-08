import { IsNotEmpty, IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterAuthDto {
    @IsNotEmpty({ message: 'Nama harus diisi' })
    @IsString({ message: 'Nama harus berupa teks' })
    @MaxLength(150, { message: 'Nama maksimal 150 karakter' })
    readonly name: string;

    @IsNotEmpty({ message: 'Email harus diisi' })
    @IsEmail({}, { message: 'Format email tidak valid' })
    readonly email: string;

    @IsNotEmpty({ message: 'Password harus diisi' })
    @MinLength(6, { message: 'Password harus minimal 6 karakter' })
    readonly password: string;
}