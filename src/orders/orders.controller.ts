import { Controller, Get, Param, Post, Body, Patch, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import { CreateOrderDto } from './dto/create-orders.js';
import { UpdateOrderStatusDto } from './dto/update-orders.js';

@Controller('orders')
export class OrdersController {
    constructor(private orderService: OrdersService) {}

    // daftar pesanan
    @Get()
    getAllOrders() {
        return this.orderService.findAll();
    }

    // detail pesanan beserta item dan produk
    @Get(':id')
    getOrderById(@Param('id') id: string) {
        return this.orderService.findOne(id);
    }

    // membuat pesanan baru beserta item
    @Post()
    createOrder(@Body() order: CreateOrderDto) {
        return this.orderService.create(order);
    }

    // memperbarui status pesanan
    @Patch(':id/status')
    updateOrderStatus(@Param('id') id: string, @Body() status: UpdateOrderStatusDto) {
        return this.orderService.updateStatus(id, status);
    }

    // menghapus pesanan
    @Delete(':id')
    deleteOrder(@Param('id') id: string) {
        return this.orderService.delete(id);
    }
}