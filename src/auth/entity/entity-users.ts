import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 150 })
    name: string;

    @Column({ type: 'varchar', length: 150, unique: true })
    email: string;

    // select: false = password tidak ikut terambil saat query biasa,
    // jadi tidak bocor ke response. Hanya diambil secara eksplisit saat login
    @Column({ type: 'varchar', length: 255, select: false })
    password: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

}