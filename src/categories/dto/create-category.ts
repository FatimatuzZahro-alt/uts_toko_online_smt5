import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
    @IsNotEmpty({ message: 'Nama kategori harus diisi' })
    @IsString({ message: 'Nama kategori harus berupa string' })
    readonly name: string;
}