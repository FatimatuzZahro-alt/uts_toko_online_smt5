import {
    Entity, PrimaryGeneratedColumn, Column, OneToMany,
    CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Order } from '../../orders/entity/entity-orders.js';


@Entity('customers')
export class Customer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 150 })
    name: string;

    @Column({ type: 'varchar', length: 150, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 20 })
    phone: string;

    @Column({ type: 'text', nullable: true })
    address: string | null;

    @OneToMany(() => Order, (order) => order.customer)
    orders: Relation<Order[]>;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', nullable: true })
    deletedAt: Date | null;
    
}