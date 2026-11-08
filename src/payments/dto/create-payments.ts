// class-validator: kumpulan dekorator untuk memvalidasi data yang dikirim client
import { IsNotEmpty, IsUUID, IsIn } from 'class-validator';

// DTO = bentuk data yang BOLEH dikirim client saat membuat pembayaran
export class CreatePaymentDto {
    // orderId wajib diisi dan harus berformat UUID versi 4
    @IsNotEmpty({ message: 'ID pesanan harus diisi' })
    @IsUUID('4', { message: 'ID pesanan tidak valid' })
    readonly orderId: string;

    // method hanya boleh salah satu dari daftar di dalam IsIn
    @IsNotEmpty({ message: 'Metode pembayaran harus diisi' })
    @IsIn(['transfer', 'cod', 'e_wallet', 'credit_card'], {
        message: 'Metode pembayaran tidak valid',
    })
    readonly method: string;

    // amount, status, dan paidAt SENGAJA tidak ada di sini.
    // Jumlah bayar diambil dari total pesanan oleh server, jadi client
    // tidak bisa mengisi nominal sembarangan.
}