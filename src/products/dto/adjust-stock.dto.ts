import { IsInt, IsNotEmpty, Max, Min, NotEquals } from 'class-validator';

export class AdjustStockDto {
    // positif = tambah stok, negatif = kurangi stok
    // tidak boleh 0 (tidak ada perubahan) dan dibatasi ±1.000.000 per sekali penyesuaian
    @IsNotEmpty({ message: 'Jumlah penyesuaian harus diisi' })
    @IsInt({ message: 'Jumlah penyesuaian harus berupa bilangan bulat' })
    @NotEquals(0, { message: 'Jumlah penyesuaian tidak boleh 0' })
    @Min(-1000000, { message: 'Jumlah penyesuaian terlalu kecil (minimal -1.000.000)' })
    @Max(1000000, { message: 'Jumlah penyesuaian terlalu besar (maksimal 1.000.000)' })
    readonly adjustment: number;
}