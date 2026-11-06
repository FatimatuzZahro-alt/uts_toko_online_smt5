import { IsNotEmpty, IsOptional, IsString, IsNumber, IsInt, IsUUID, MaxLength, Min } from 'class-validator';

export class CreateProductDto {
    @IsNotEmpty({ message: 'Nama produk harus diisi' })
    @IsString({ message: 'Nama produk harus berupa teks' })
    @MaxLength(150, { message: 'Nama produk maksimal 150 karakter' })
    readonly name: string;

    @IsOptional()
    @IsString({ message: 'Deskripsi harus berupa teks' })
    readonly description?: string;

    @IsNotEmpty({ message: 'Harga harus diisi' })
    @IsNumber({}, { message: 'Harga harus berupa angka' })
    @Min(0, { message: 'Harga tidak boleh negatif' })
    readonly price: number;

    @IsNotEmpty({ message: 'Stok harus diisi' })
    @IsInt({ message: 'Stok harus berupa bilangan bulat' })
    @Min(0, { message: 'Stok tidak boleh negatif' })
    readonly stock: number;

    @IsNotEmpty({ message: 'ID kategori harus diisi' })
    @IsUUID('4', { message: 'ID kategori tidak valid' })
    readonly categoryId: string;
}