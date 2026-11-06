import { IsNotEmpty, IsEmail, IsOptional, IsString, MaxLength, Matches } from 'class-validator';

export class CreateCustomerDto {
    @IsNotEmpty({ message: 'Nama harus diisi' })
    @IsString({ message: 'Nama harus berupa teks' })
    @MaxLength(150, { message: 'Nama maksimal 150 karakter' })
    readonly name: string;

    @IsNotEmpty({ message: 'Email harus diisi' })
    @IsEmail({}, { message: 'Format email tidak valid' })
    readonly email: string;

    @IsNotEmpty({ message: 'Nomor telepon harus diisi' })
    @Matches(/^[0-9+]{10,20}$/, { message: 'Nomor telepon tidak valid' })
    readonly phone: string;

    @IsOptional()
    @IsString({ message: 'Alamat harus berupa teks' })
    readonly address?: string;
}