import {
    Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn,
    CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Category } from '../../categories/entity/entity-category.js';
import { OrderItem } from '../../order-items/entity/entity-order-items.js';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 150 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string | null;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    price: number;

    @Column({ type: 'int', default: 0 })
    stock: number;

    @Column({ type: 'uuid', name: 'category_id', nullable: true })
    categoryId: string | null;

    @ManyToOne(() => Category, (category) => category.products, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'category_id' })
    category: Relation<Category>;

    @OneToMany(() => OrderItem, (item) => item.product)
    orderItems: Relation<OrderItem[]>;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', nullable: true })
    deletedAt: Date | null;
}