import { IsNotEmpty, IsInt, Min } from 'class-validator';

export class UpdateOrderItemDto {
    @IsNotEmpty({ message: 'Jumlah harus diisi' })
    @IsInt({ message: 'Jumlah harus berupa bilangan bulat' })
    @Min(1, { message: 'Jumlah minimal 1' })
    readonly quantity: number;
}