import { IsNotEmpty, IsIn } from 'class-validator';

export class UpdateOrderStatusDto {
    @IsNotEmpty({ message: 'Status harus diisi' })
    @IsIn(['pending', 'paid', 'shipped', 'completed', 'cancelled'], {
        message: 'Status tidak valid',
    })
    readonly status: string;
}