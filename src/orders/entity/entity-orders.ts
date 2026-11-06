import {
    Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn,
    CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Customer } from '../../customers/entity/entity-customers.js';
import { OrderItem } from '../../order-items/entity/entity-order-items.js';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 50, name: 'order_number', unique: true })
    orderNumber: string;

    @Column({ type: 'uuid', name: 'customer_id' })
    customerId: string;

    @ManyToOne(() => Customer, (customer) => customer.orders, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'customer_id' })
    customer: Relation<Customer>;

    @Column({ type: 'varchar', length: 30, default: 'pending' })
    status: string;

    @Column({ type: 'decimal', precision: 12, scale: 2, name: 'total_amount', default: 0 })
    totalAmount: number;

    @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
    items: Relation<OrderItem[]>;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}