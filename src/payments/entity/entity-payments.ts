import {
    Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,
    CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
// Relation<> dipakai supaya tidak error "Cannot access before initialization"
// pada relasi dua arah (Order <-> Payment saling mengimpor)
import type { Relation } from 'typeorm';
import { Order } from '../../orders/entity/entity-orders.js';

// @Entity menandai class ini sebagai tabel "payments" di database
@Entity('payments')
export class Payment {
    // primary key berupa UUID yang dibuat otomatis
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // kolom foreign key: menyimpan id pesanan yang dibayar
    @Column({ type: 'uuid', name: 'order_id' })
    orderId: string;

    // relasi: BANYAK pembayaran milik SATU pesanan (ManyToOne)
    // satu pesanan bisa punya beberapa pembayaran, misalnya gagal lalu mencoba lagi.
    // onDelete CASCADE: kalau pesanan dihapus, pembayarannya ikut terhapus
    @ManyToOne(() => Order, (order) => order.payments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' }) // kolom order_id yang menghubungkan kedua tabel
    order: Relation<Order>;

    // metode pembayaran: transfer, cod, dst.
    @Column({ type: 'varchar', length: 30 })
    method: string;

    // jumlah yang harus dibayar. decimal dipakai untuk uang agar tidak ada
    // masalah pembulatan seperti pada float
    @Column({ type: 'decimal', precision: 12, scale: 2 })
    amount: number;

    // status pembayaran: unpaid (awal), paid, atau failed
    @Column({ type: 'varchar', length: 20, default: 'unpaid' })
    status: string;

    // tanggal pembayaran berhasil. null selama belum dibayar
    @Column({ type: 'timestamp', name: 'paid_at', nullable: true })
    paidAt: Date | null;

    // terisi otomatis saat data dibuat
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    // terisi otomatis setiap data diubah
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}