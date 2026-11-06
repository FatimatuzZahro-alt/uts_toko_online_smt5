import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entity/entity-category.js';
import { CreateCategoryDto } from './dto/create-category.js';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}

    async findAll(): Promise<Category[]> {
        return this.categoryRepository.find({ order: { createdAt: 'DESC' } });
    }

    async findOne(id: string): Promise<Category> {
        const category = await this.categoryRepository.findOne({
            where: { id },
            relations: { products: true },
        });
        if (!category) {
            throw new NotFoundException('Kategori tidak ditemukan');
        }
        return category;
    }

    async create(dto: CreateCategoryDto): Promise<Category> {
        const newCategory = this.categoryRepository.create(dto);
        return await this.categoryRepository.save(newCategory);
    }

    async update(id: string, dto: CreateCategoryDto): Promise<Category> {
        const category = await this.findOne(id);
        const updated = this.categoryRepository.merge(category, dto);
        return await this.categoryRepository.save(updated);
    }

    async delete(id: string): Promise<{ message: string; deletedId: string }> {
        await this.findOne(id);
        await this.categoryRepository.delete(id);
        return { message: 'Kategori berhasil dihapus', deletedId: id };
    }
}