import { Controller, Get, Post, Param, Body, Put, Delete } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customers.js';
import { CustomersService } from './customers.service.js';
import { CreateCategoryDto } from '../categories/dto/create-category.js';

@Controller('customers')
export class CustomersController {
    constructor(private customerService: CustomersService) {} //constructor untuk menginisialisasi service

    //menampilkan daftar kategori
    @Get()
    getAllCategories() {
        return this.customerService.findAll();
    }

    //mengambil data kategori berdasarkan id
    @Get(':id')
    getCustomerById(@Param('id') id: string) { //param dipkae buat ambil parameter dari URL
        //logic untuk mengambil data berdasarkan id
        return this.customerService.findOne(id);
    }

    //menyimpan data baru ke database
    @Post()
    createCustomer(@Body() customer:CreateCustomerDto) { //body dipake buat ambil data dari request body
        //logic untuk menyimpan data baru ke database
        return this.customerService.create(customer);
    }

    //update data kategori berdasarkan id
    @Put(':id')
    updateCustomer(
        @Param('id') id: string,
        @Body() customer: CreateCustomerDto
    ) { //param dipake buat ambil parameter dari URL, body dipake buat ambil data dari request body
        //logic untuk update data kategori berdasarkan id
        return this.customerService.update((id), customer);
    }

    //menghapus data kategori berdasarkan id
    @Delete(':id')
    deleteCustomer(@Param('id') id: string) { //param dipake buat ambil parameter dari URL
        //logic untuk menghapus data kategori berdasarkan id
        return this.customerService.delete(id);
    }

}

