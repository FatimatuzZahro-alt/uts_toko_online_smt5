import { IsNotEmpty, IsUUID, IsArray, ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from '../../order-items/dto/create-order-items.js';

export class CreateOrderDto {
    @IsNotEmpty({ message: 'ID pelanggan harus diisi' })
    @IsUUID('4', { message: 'ID pelanggan tidak valid' })
    readonly customerId: string;

    @IsArray({ message: 'Item pesanan harus berupa daftar' })
    @ArrayMinSize(1, { message: 'Pesanan minimal berisi 1 item' })
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    readonly items: CreateOrderItemDto[];
}