import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from './entity/entity-orders.js';
import { OrderItem } from '../order-items/entity/entity-order-items.js';
import { Product } from '../products/entity/entity-products.js';
import { Customer } from '../customers/entity/entity-customers.js';
import { CreateOrderDto } from './dto/create-orders.js';
import { UpdateOrderStatusDto } from './dto/update-orders.js';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        private readonly dataSource: DataSource,
    ) {}

    async findAll(): Promise<Order[]> {
        return this.orderRepository.find({
            relations: { customer: true },
            order: { createdAt: 'DESC' },
        });
    }

    // detail pesanan beserta item dan informasi produk
    async findOne(id: string): Promise<Order> {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: { customer: true, items: { product: true }, payments: true },
        });
        if (!order) {
            throw new NotFoundException('Pesanan tidak ditemukan');
        }
        return order;
    }

    private generateOrderNumber(): string {
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.floor(1000 + Math.random() * 9000);
        return `ORD-${date}-${random}`;
    }

    async create(dto: CreateOrderDto): Promise<Order> {
        // gabungkan produk yang sama supaya tidak jadi dua baris
        const merged = new Map<string, number>();
        for (const item of dto.items) {
            merged.set(item.productId, (merged.get(item.productId) ?? 0) + item.quantity);
        }

        const orderId = await this.dataSource.transaction(async (manager) => {
            const customer = await manager.findOneBy(Customer, { id: dto.customerId });
            if (!customer) {
                throw new NotFoundException('Pelanggan tidak ditemukan');
            }

            const items: OrderItem[] = [];
            let total = 0;

            for (const [productId, quantity] of merged) {
                const product = await manager.findOne(Product, {
                    where: { id: productId },
                    lock: { mode: 'pessimistic_write' },
                });
                if (!product) {
                    throw new NotFoundException(`Produk ${productId} tidak ditemukan`);
                }
                if (product.stock === 0) {
                    throw new BadRequestException(`Stok ${product.name} habis`);
                }
                if (product.stock < quantity) {
                    throw new BadRequestException(
                        `Stok ${product.name} tidak cukup (tersisa ${product.stock})`,
                    );
                }

                const price = Number(product.price);
                const subtotal = price * quantity;
                total += subtotal;

                product.stock -= quantity;
                await manager.save(product);

                items.push(manager.create(OrderItem, { productId, quantity, price, subtotal }));
            }

            const order = manager.create(Order, {
                orderNumber: this.generateOrderNumber(),
                customerId: dto.customerId,
                status: 'pending',
                totalAmount: total,
                items,
            });
            const saved = await manager.save(order);
            return saved.id;
        });

        return this.findOne(orderId);
    }

    // mengubah status pesanan, pembatalan mengembalikan stok
    async updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<Order> {
        const order = await this.findOne(id);

        if (order.status === 'cancelled') {
            throw new BadRequestException('Pesanan yang sudah dibatalkan tidak dapat diubah');
        }
        if (order.status === 'completed') {
            throw new BadRequestException('Pesanan yang sudah selesai tidak dapat diubah');
        }
        if (dto.status === 'cancelled' && order.status === 'shipped') {
            throw new BadRequestException('Pesanan yang sudah dikirim tidak dapat dibatalkan');
        }

        await this.dataSource.transaction(async (manager) => {
            if (dto.status === 'cancelled') {
                await this.restoreStock(manager, order.items);
            }
            order.status = dto.status;
            await manager.save(Order, order);
        });

        return this.findOne(id);
    }

    // hanya pesanan pending atau cancelled yang boleh dihapus
    async delete(id: string): Promise<{ message: string; deletedId: string }> {
        const order = await this.findOne(id);

        if (order.status !== 'pending' && order.status !== 'cancelled') {
            throw new BadRequestException(
                'Hanya pesanan berstatus pending atau cancelled yang dapat dihapus',
            );
        }

        await this.dataSource.transaction(async (manager) => {
            if (order.status === 'pending') {
                await this.restoreStock(manager, order.items);
            }
            await manager.delete(Order, id);
        });

        return { message: 'Pesanan berhasil dihapus', deletedId: id };
    }

    private async restoreStock(
        manager: DataSource['manager'],
        items: OrderItem[],
    ): Promise<void> {
        for (const item of items) {
            await manager.increment(Product, { id: item.productId }, 'stock', item.quantity);
        }
    }
}
