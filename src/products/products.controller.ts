import { Controller, Get, Param, Post, Body, Put, Delete, Patch, Query } from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-products.js';
import { AdjustStockDto } from './dto/adjust-stock.dto.js';

@Controller('products')
export class ProductsController {
    constructor(private productService: ProductsService) {}

    @Get()
    getAllProducts() {
        return this.productService.findAll();
    }

    @Get('stock')
    getAllStock(@Query('available') available?: string) {
        return this.productService.findAllStock(available === 'true');
    }

    @Get(':id/stock')
    getProductStock(@Param('id') id: string) {
        return this.productService.getStock(id);
    }

    @Patch(':id/stock')
    adjustProductStock(@Param('id') id: string, @Body() dto: AdjustStockDto) {
        return this.productService.adjustStock(id, dto);
    }

    @Get(':id')
    getProductById(@Param('id') id: string) {
        return this.productService.findOne(id);
    }

    @Post()
    createProduct(@Body() product: CreateProductDto) {
        return this.productService.create(product);
    }

    @Put(':id')
    updateProduct(@Param('id') id: string, @Body() product: CreateProductDto) {
        return this.productService.update(id, product);
    }

    @Delete(':id')
    deleteProduct(@Param('id') id: string) {
        return this.productService.delete(id);
    }
}