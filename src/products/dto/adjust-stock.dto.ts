import { IsNotEmpty, IsInt } from 'class-validator';

export class AdjustStockDto {
    // positif = tambah stok, negatif = kurangi stok
    @IsNotEmpty({ message: 'Jumlah penyesuaian harus diisi' })
    @IsInt({ message: 'Jumlah penyesuaian harus berupa bilangan bulat' })
    readonly adjustment: number;
}