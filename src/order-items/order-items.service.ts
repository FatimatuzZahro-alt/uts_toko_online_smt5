import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { OrderItem } from './entity/entity-order-items.js';
import { Order } from '../orders/entity/entity-orders.js';
import { Product } from '../products/entity/entity-products.js';
import { CreateOrderItemDto } from './dto/create-order-items.js';
import { UpdateOrderItemDto } from './dto/update-order-items.js';


@Injectable()
export class OrderItemsService {
    constructor(
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,
        private readonly dataSource: DataSource,
    ) {}

    // daftar item, bisa difilter berdasarkan pesanan dan/atau produk
    async findAll(orderId?: string, productId?: string): Promise<OrderItem[]> {
        return this.orderItemRepository.find({
            where: {
                ...(orderId && { orderId }),
                ...(productId && { productId }),
            },
            relations: { product: true, order: true },
        });
    }

    async findOne(id: string): Promise<OrderItem> {
        const item = await this.orderItemRepository.findOne({
            where: { id },
            relations: { product: true, order: true },
        });
        if (!item) {
            throw new NotFoundException('Item pesanan tidak ditemukan');
        }
        return item;
    }

    // hitung ulang total pesanan dari semua item-nya
    private async recalcTotal(manager: EntityManager, orderId: string): Promise<void> {
        const items = await manager.find(OrderItem, { where: { orderId } });
        const total = items.reduce((sum, i) => sum + Number(i.subtotal), 0);
        await manager.update(Order, { id: orderId }, { totalAmount: total });
    }

    private async getPendingOrder(manager: EntityManager, orderId: string): Promise<Order> {
        const order = await manager.findOneBy(Order, { id: orderId });
        if (!order) {
            throw new NotFoundException('Pesanan tidak ditemukan');
        }
        if (order.status !== 'pending') {
            throw new BadRequestException(
                'Item hanya dapat diubah pada pesanan berstatus pending',
            );
        }
        return order;
    }

    async create(dto: CreateOrderItemDto): Promise<OrderItem> {
        const id = await this.dataSource.transaction(async (manager) => {
            await this.getPendingOrder(manager, dto.productId);

            const product = await manager.findOne(Product, {
                where: { id: dto.productId },
                lock: { mode: 'pessimistic_write' },
            });
            if (!product) {
                throw new NotFoundException('Produk tidak ditemukan');
            }

            const existing = await manager.findOneBy(OrderItem, {
                orderId: dto.productId,
                productId: dto.productId,
            });
            const addQty = dto.quantity;

            if (product.stock < addQty) {
                throw new BadRequestException(
                    `Stok ${product.name} tidak cukup (tersisa ${product.stock})`,
                );
            }
            product.stock -= addQty;
            await manager.save(product);

            let item: OrderItem;
            if (existing) {
                // produk sama sudah ada, tambahkan jumlahnya, harga snapshot tetap
                existing.quantity += addQty;
                existing.subtotal = Number(existing.price) * existing.quantity;
                item = await manager.save(existing);
            } else {
                const price = Number(product.price);
                item = await manager.save(
                    manager.create(OrderItem, {
                        orderId: dto.productId,
                        productId: dto.productId,
                        quantity: addQty,
                        price,
                        subtotal: price * addQty,
                    }),
                );
            }

            await this.recalcTotal(manager, dto.productId);
            return item.id;
        });

        return this.findOne(id);
    }

    async update(id: string, dto: UpdateOrderItemDto): Promise<OrderItem> {
        await this.dataSource.transaction(async (manager) => {
            const item = await manager.findOneBy(OrderItem, { id });
            if (!item) {
                throw new NotFoundException('Item pesanan tidak ditemukan');
            }
            await this.getPendingOrder(manager, item.orderId);

            const product = await manager.findOne(Product, {
                where: { id: item.productId },
                lock: { mode: 'pessimistic_write' },
            });
            if (!product) {
                throw new NotFoundException('Produk tidak ditemukan');
            }

            // selisih jumlah: positif = butuh stok tambahan, negatif = stok kembali
            const diff = dto.quantity - item.quantity;
            if (diff > 0 && product.stock < diff) {
                throw new BadRequestException(
                    `Stok ${product.name} tidak cukup (tersisa ${product.stock})`,
                );
            }
            product.stock -= diff;
            await manager.save(product);

            item.quantity = dto.quantity;
            item.subtotal = Number(item.price) * dto.quantity;
            await manager.save(item);

            await this.recalcTotal(manager, item.orderId);
        });

        return this.findOne(id);
    }

    async delete(id: string): Promise<{ message: string; deletedId: string }> {
        await this.dataSource.transaction(async (manager) => {
            const item = await manager.findOneBy(OrderItem, { id });
            if (!item) {
                throw new NotFoundException('Item pesanan tidak ditemukan');
            }
            await this.getPendingOrder(manager, item.orderId);

            await manager.increment(Product, { id: item.productId }, 'stock', item.quantity);
            await manager.delete(OrderItem, id);
            await this.recalcTotal(manager, item.orderId);
        });

        return { message: 'Item pesanan berhasil dihapus', deletedId: id };
    }
}