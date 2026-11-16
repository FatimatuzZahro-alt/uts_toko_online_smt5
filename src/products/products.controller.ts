import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Param,
    ParseBoolPipe,
    ParseUUIDPipe,
    Patch,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-products.js';
import { AdjustStockDto } from './dto/adjust-stock.dto.js';

@Controller('products')
export class ProductsController {
    constructor(private productService: ProductsService) {}

    // GET /products : daftar semua produk beserta kategorinya
    @Get()
    getAllProducts() {
        return this.productService.findAll();
    }

    // GET /products/stock?available=true : daftar stok semua produk
    // available dibaca sebagai boolean (default false), nilai selain true/false ditolak 400
    // NOTE: route ini harus di atas ':id' supaya "stock" tidak dianggap sebagai id
    @Get('stock')
    getAllStock(
        @Query('available', new DefaultValuePipe(false), ParseBoolPipe) available: boolean,
    ) {
        return this.productService.findAllStock(available);
    }

    // GET /products/:id/stock : stok satu produk
    // ParseUUIDPipe menolak id yang bukan UUID dengan 400 (bukan 500)
    @Get(':id/stock')
    getProductStock(@Param('id', ParseUUIDPipe) id: string) {
        return this.productService.getStock(id);
    }

    // PATCH /products/:id/stock : tambah/kurangi stok manual
    @Patch(':id/stock')
    adjustProductStock(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: AdjustStockDto,
    ) {
        return this.productService.adjustStock(id, dto);
    }

    // GET /products/:id : detail satu produk
    @Get(':id')
    getProductById(@Param('id', ParseUUIDPipe) id: string) {
        return this.productService.findOne(id);
    }

    // POST /products : tambah produk baru
    @Post()
    createProduct(@Body() product: CreateProductDto) {
        return this.productService.create(product);
    }

    // PUT /products/:id : ubah data produk
    @Put(':id')
    updateProduct(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() product: CreateProductDto,
    ) {
        return this.productService.update(id, product);
    }

    @Delete(':id')
    deleteProduct(@Param('id', ParseUUIDPipe) id: string) {
        return this.productService.delete(id);
    }
}