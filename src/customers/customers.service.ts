import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entity/entity-customers.js';
import { CreateCustomerDto } from './dto/create-customers.js';

@Injectable()
export class CustomersService {
    constructor(
        @InjectRepository(Customer)
        private readonly customerRepository: Repository<Customer>,
    ) {}

    async findAll(): Promise<Customer[]> {
        return this.customerRepository.find({ order: { createdAt: 'DESC' } });
    }

    async findOne(id: string): Promise<Customer> {
        const customer = await this.customerRepository.findOneBy({ id });
        if (!customer) {
            throw new NotFoundException('Pelanggan tidak ditemukan');
        }
        return customer;
    }

    async create(dto: CreateCustomerDto): Promise<Customer> {
        const newCustomer = this.customerRepository.create(dto);
        return await this.customerRepository.save(newCustomer);
    }

    async update(id: string, dto: CreateCustomerDto): Promise<Customer> {
        const customer = await this.findOne(id);
        const updated = this.customerRepository.merge(customer, dto);
        return await this.customerRepository.save(updated);
    }

    async delete(id: string): Promise<{ message: string; deletedId: string }> {
        await this.findOne(id);
        await this.customerRepository.softDelete(id);
        return { message: 'Pelanggan berhasil dihapus', deletedId: id };
    }

        // mengambil pelanggan beserta semua pesanannya
    async findOneWithOrders(id: string): Promise<Customer> {
        const customer = await this.customerRepository.findOne({
            where: { id },
            // relations: ambil juga data dari tabel orders yang berelasi
            relations: { orders: true },
            // urutkan pesanan dari yang terbaru
            order: { orders: { createdAt: 'DESC' } },
        });
        if (!customer) {
            throw new NotFoundException('Pelanggan tidak ditemukan');
        }
        return customer;
    }
}