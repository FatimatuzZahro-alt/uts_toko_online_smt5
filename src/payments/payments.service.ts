import {
    BadRequestException, ConflictException, Injectable, NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// DataSource: dipakai untuk membuat transaksi database
// In: operator pencarian "status salah satu dari ..."
import { DataSource, In, Repository } from 'typeorm';
import { Payment } from './entity/entity-payments.js';
import { Order } from '../orders/entity/entity-orders.js';
import { CreatePaymentDto } from './dto/create-payments.js';
import { UpdatePaymentStatusDto } from './dto/update-payments.js';

@Injectable()
export class PaymentsService {
    constructor(
        // repository = alat untuk baca/tulis tabel payments
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
        // repository pesanan, dipakai untuk mengecek pesanan saat membuat pembayaran
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        private readonly dataSource: DataSource,
    ) {}

    // menampilkan semua pembayaran, bisa difilter berdasarkan orderId
    async findAll(orderId?: string): Promise<Payment[]> {
        return this.paymentRepository.find({
            // kalau orderId diisi, filter. Kalau tidak, ambil semuanya
            where: orderId ? { orderId } : {},
            relations: { order: true }, // sertakan data pesanannya
            order: { createdAt: 'DESC' }, // yang terbaru di atas
        });
    }

    // mengambil satu pembayaran berdasarkan id
    async findOne(id: string): Promise<Payment> {
        const payment = await this.paymentRepository.findOne({
            where: { id },
            relations: { order: true },
        });
        // kalau tidak ada, kirim error 404
        if (!payment) {
            throw new NotFoundException('Pembayaran tidak ditemukan');
        }
        return payment;
    }

    // mencatat pembayaran baru
    async create(dto: CreatePaymentDto): Promise<Payment> {
        // 1. pesanan harus ada
        const order = await this.orderRepository.findOneBy({ id: dto.orderId });
        if (!order) {
            throw new NotFoundException('Pesanan tidak ditemukan');
        }

        // 2. hanya pesanan yang masih pending yang boleh dibuatkan pembayaran
        if (order.status !== 'pending') {
            throw new BadRequestException(
                'Pembayaran hanya dapat dibuat untuk pesanan berstatus pending',
            );
        }

        // 3. satu pesanan tidak boleh punya dua pembayaran aktif.
        // "aktif" = unpaid atau paid. Yang failed boleh diulang.
        const active = await this.paymentRepository.findOne({
            where: { orderId: dto.orderId, status: In(['unpaid', 'paid']) },
        });
        if (active) {
            // 409 Conflict: permintaan bentrok dengan data yang sudah ada
            throw new ConflictException('Pesanan ini sudah memiliki pembayaran yang aktif');
        }

        // 4. buat pembayaran. amount diambil dari total pesanan (bukan dari client)
        const payment = this.paymentRepository.create({
            orderId: dto.orderId,
            method: dto.method,
            amount: order.totalAmount,
            status: 'unpaid', // status awal selalu unpaid
            paidAt: null, // belum dibayar, jadi tanggal bayar kosong
        });
        return await this.paymentRepository.save(payment);
    }

    // mengubah status pembayaran menjadi paid atau failed
    async updateStatus(id: string, dto: UpdatePaymentStatusDto): Promise<Payment> {
        // transaksi: semua langkah di dalamnya berhasil bersama,
        // atau dibatalkan semua kalau ada satu yang gagal
        await this.dataSource.transaction(async (manager) => {
            const payment = await manager.findOneBy(Payment, { id });
            if (!payment) {
                throw new NotFoundException('Pembayaran tidak ditemukan');
            }

            // pembayaran yang sudah paid atau failed tidak boleh diubah lagi
            if (payment.status !== 'unpaid') {
                throw new BadRequestException(
                    `Pembayaran berstatus ${payment.status} tidak dapat diubah`,
                );
            }

            if (dto.status === 'paid') {
                // cek pesanannya masih pending (bisa saja sudah dibatalkan)
                const order = await manager.findOneBy(Order, { id: payment.orderId });
                if (!order || order.status !== 'pending') {
                    throw new BadRequestException(
                        'Pesanan tidak lagi berstatus pending, pembayaran tidak dapat dilunasi',
                    );
                }

                payment.status = 'paid';
                payment.paidAt = new Date(); // isi tanggal pembayaran otomatis
                // status pesanan ikut menjadi paid
                await manager.update(Order, { id: order.id }, { status: 'paid' });
            } else {
                // status failed: cukup tandai gagal, pesanan tetap pending
                payment.status = 'failed';
            }

            await manager.save(payment);
        });

        // ambil ulang data terbaru untuk dikembalikan sebagai response
        return this.findOne(id);
    }

    // menghapus pembayaran
    async delete(id: string): Promise<{ message: string; deletedId: string }> {
        const payment = await this.findOne(id);
        // pembayaran yang sudah lunas adalah catatan keuangan, jadi tidak boleh dihapus
        if (payment.status === 'paid') {
            throw new BadRequestException('Pembayaran yang sudah paid tidak dapat dihapus');
        }
        await this.paymentRepository.delete(id);
        return { message: 'Pembayaran berhasil dihapus', deletedId: id };
    }
}