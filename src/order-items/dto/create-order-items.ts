import { IsNotEmpty, IsUUID, IsInt, Min } from 'class-validator';

export class CreateOrderItemDto {
    @IsNotEmpty({ message: 'ID produk harus diisi' })
    @IsUUID('4', { message: 'ID produk tidak valid' })
    readonly productId: string;

    @IsNotEmpty({ message: 'Jumlah harus diisi' })
    @IsInt({ message: 'Jumlah harus berupa bilangan bulat' })
    @Min(1, { message: 'Jumlah minimal 1' })
    readonly quantity: number;
}