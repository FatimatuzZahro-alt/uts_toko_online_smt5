import { Controller, Get, Param, Post, Body, Put, Delete, Query } from '@nestjs/common';
import { OrderItemsService } from './order-items.service.js';
import { CreateOrderItemDto } from './dto/create-order-items.js';
import { UpdateOrderItemDto } from './dto/update-order-items.js';

@Controller('order-items')
export class OrderItemsController {
    constructor(private orderItemService: OrderItemsService) {}

    // daftar item, bisa difilter: GET /order-items?orderId=... atau ?productId=...
    @Get()
    getAllOrderItems(
        @Query('orderId') orderId?: string,
        @Query('productId') productId?: string,
    ) {
        return this.orderItemService.findAll(orderId, productId);
    }

    // detail satu item beserta informasi produk
    @Get(':id')
    getOrderItemById(@Param('id') id: string) {
        return this.orderItemService.findOne(id);
    }

    // menambah item ke pesanan pending
    @Post()
    createOrderItem(@Body() item: CreateOrderItemDto) {
        return this.orderItemService.create(item);
    }

    // mengubah jumlah item
    @Put(':id')
    updateOrderItem(@Param('id') id: string, @Body() item: UpdateOrderItemDto) {
        return this.orderItemService.update(id, item);
    }


    // menghapus item dari pesanan
    @Delete(':id')
    deleteOrderItem(@Param('id') id: string) {
        return this.orderItemService.delete(id);
    }
}