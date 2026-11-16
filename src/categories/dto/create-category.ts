import { IsNotEmpty, IsString } from 'class-validator';
import { MaxLength } from 'class-validator';


export class CreateCategoryDto {
    @IsNotEmpty({ message: 'Nama kategori harus diisi' })
    @IsString({ message: 'Nama kategori harus berupa teks' })
    @MaxLength(100, { message: 'Nama kategori maksimal 100 karakter' })
    readonly name: string;
}