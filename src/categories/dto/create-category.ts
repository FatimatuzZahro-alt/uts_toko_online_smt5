import { IsNotEmpty, IsString } from 'class-validator';
import { MaxLength } from 'class-validator';


export class CreateCategoryDto {
    @IsNotEmpty({ message: 'Nama kategori harus diisi' })
    @IsString()
    @MaxLength(100)
    readonly name: string;
}