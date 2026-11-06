import { Controller, Get, Post, Param, Body, Put, Delete } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.js';
import { CategoriesService } from './categories.service.js';

@Controller('categories')
export class CategoriesController {
    constructor(private categoryService: CategoriesService) {} //constructor untuk menginisialisasi service

    //menampilkan daftar kategori
    @Get()
    getAllCategories() {
        return this.categoryService.findAll();
    }

    //mengambil data kategori berdasarkan id
    @Get(':id')
    getCategoryById(@Param('id') id: string) { //param dipkae buat ambil parameter dari URL
        //logic untuk mengambil data buku berdasarkan id
        return this.categoryService.findOne(id);
    }

    //menyimpan data baru ke database
    @Post()
    createCategory(@Body() category:CreateCategoryDto) { //body dipake buat ambil data dari request body
        //logic untuk menyimpan data baru ke database
        return this.categoryService.create(category);
    }

    //update data kategori berdasarkan id
    @Put(':id')
    updateCategory(
        @Param('id') id: string,
        @Body() category: CreateCategoryDto
    ) { //param dipake buat ambil parameter dari URL, body dipake buat ambil data dari request body
        //logic untuk update data kategori berdasarkan id
        return this.categoryService.update((id), category);
    }

    //menghapus data kategori berdasarkan id
    @Delete(':id')
    deleteCategory(@Param('id') id: string) { //param dipake buat ambil parameter dari URL
        //logic untuk menghapus data kategori berdasarkan id
        return this.categoryService.delete(id);
    }

}

