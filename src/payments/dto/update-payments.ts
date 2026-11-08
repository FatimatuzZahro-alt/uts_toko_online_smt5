import { IsNotEmpty, IsIn } from 'class-validator';

// DTO untuk mengubah status pembayaran
export class UpdatePaymentStatusDto {
    // client hanya boleh mengirim 'paid' atau 'failed'.
    // 'unpaid' tidak ada karena itu status awal yang diisi otomatis.
    @IsNotEmpty({ message: 'Status harus diisi' })
    @IsIn(['paid', 'failed'], { message: 'Status harus paid atau failed' })
    readonly status: string;
}