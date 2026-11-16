import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Product } from './entity/entity-products.js';
import { Category } from '../categories/entity/entity-category.js';
import { CreateProductDto } from './dto/create-products.js';
import { AdjustStockDto } from './dto/adjust-stock.dto.js';

// batas maksimal tipe int di PostgreSQL
const MAX_STOCK = 2147483647;

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}

    async findAll(): Promise<Product[]> {
        return this.productRepository.find({
            relations: { category: true },
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string): Promise<Product> {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: { category: true },
        });
        if (!product) {
            throw new NotFoundException('Produk tidak ditemukan');
        }
        return product;
    }

    // memastikan kategori yang dipilih benar-benar ada
    private async checkCategory(categoryId: string): Promise<void> {
        const category = await this.categoryRepository.findOneBy({ id: categoryId });
        if (!category) {
            throw new NotFoundException('Kategori tidak ditemukan');
        }
    }

    async create(dto: CreateProductDto): Promise<Product> {
        await this.checkCategory(dto.categoryId);
        const newProduct = this.productRepository.create(dto);
        return await this.productRepository.save(newProduct);
    }

    async update(id: string, dto: CreateProductDto): Promise<Product> {
        const product = await this.findOne(id);
        await this.checkCategory(dto.categoryId);
        const updated = this.productRepository.merge(product, dto);
        return await this.productRepository.save(updated);
    }

    async delete(id: string): Promise<{ message: string; deletedId: string }> {
        await this.findOne(id);
        await this.productRepository.softDelete(id);
        return { message: 'Produk berhasil dihapus', deletedId: id };
    }

    // stok satu produk
    async getStock(id: string) {
        const product = await this.findOne(id);
        return {
            id: product.id,
            name: product.name,
            stock: product.stock,
            isAvailable: product.stock > 0,
        };
    }

    async findAllStock(onlyAvailable = false) {
        const products = await this.productRepository.find({
            where: onlyAvailable ? { stock: MoreThan(0) } : {},
            select: { id: true, name: true, stock: true },
            order: { name: 'ASC' },
        });
        return products.map((p) => ({ ...p, isAvailable: p.stock > 0 }));
    }

    // menambah atau mengurangi stok manual (restock / koreksi)
    async adjustStock(id: string, dto: AdjustStockDto) {
        const product = await this.findOne(id);
        const newStock = product.stock + dto.adjustment;

        // stok tidak boleh di bawah 0
        if (newStock < 0) {
            throw new BadRequestException(
                `Stok tidak boleh negatif (stok saat ini ${product.stock})`,
            );
        }
        if (newStock > MAX_STOCK) {
            throw new BadRequestException(
                `Stok tidak boleh melebihi ${MAX_STOCK} (stok saat ini ${product.stock})`,
            );
        }

        product.stock = newStock;
        await this.productRepository.save(product);
        return this.getStock(id);
    }
}