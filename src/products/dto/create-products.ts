import { Transform } from 'class-transformer';
import {
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Max,
    MaxLength,
    Min,
} from 'class-validator';

export class CreateProductDto {
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsNotEmpty({ message: 'Nama produk harus diisi' })
    @IsString({ message: 'Nama produk harus berupa teks' })
    @MaxLength(150, { message: 'Nama produk maksimal 150 karakter' })
    readonly name: string;

    // Deskripsi: opsional, kalau diisi harus teks dan maksimal 2000 karakter
    @IsOptional()
    @IsString({ message: 'Deskripsi harus berupa teks' })
    @MaxLength(2000, { message: 'Deskripsi maksimal 2000 karakter' })
    readonly description?: string;

    @IsNotEmpty({ message: 'Harga harus diisi' })
    @IsNumber(
        { maxDecimalPlaces: 2 },
        { message: 'Harga harus berupa angka dengan maksimal 2 angka desimal' },
    )
    @Min(0, { message: 'Harga tidak boleh negatif' })
    @Max(9999999999.99, { message: 'Harga terlalu besar' })
    readonly price: number;

    // Stok: wajib, bilangan bulat, tidak negatif, dan tidak melebihi batas tipe int database
    @IsNotEmpty({ message: 'Stok harus diisi' })
    @IsInt({ message: 'Stok harus berupa bilangan bulat' })
    @Min(0, { message: 'Stok tidak boleh negatif' })
    @Max(2147483647, { message: 'Stok terlalu besar' })
    readonly stock: number;
    
    @IsNotEmpty({ message: 'ID kategori harus diisi' })
    @IsUUID('4', { message: 'ID kategori tidak valid' })
    readonly categoryId: string;
}