import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Order } from '../../orders/entity/entity-orders.js';
import { Product } from '../../products/entity/entity-products.js';

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', name: 'order_id' })
    orderId: string;

    @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: Relation<Order>;

    @Column({ type: 'uuid', name: 'product_id' })
    productId: string;

    @ManyToOne(() => Product, (product) => product.orderItems, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'product_id' })
    product: Relation<Product>;

    @Column({ type: 'int' })
    quantity: number;

    // snapshot harga produk saat transaksi
    @Column({ type: 'decimal', precision: 12, scale: 2 })
    price: number;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    subtotal: number;
}