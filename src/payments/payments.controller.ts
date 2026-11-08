import { Controller, Get, Param, Post, Body, Patch, Delete, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service.js';
import { CreatePaymentDto } from './dto/create-payments.js';
import { UpdatePaymentStatusDto } from './dto/update-payments.js';

// semua rute di sini diawali /payments
@Controller('payments')
export class PaymentsController {
    // service di-inject lewat constructor
    constructor(private paymentService: PaymentsService) {}

    // GET /payments atau GET /payments?orderId=...
    // @Query mengambil parameter setelah tanda tanya di URL
    @Get()
    getAllPayments(@Query('orderId') orderId?: string) {
        return this.paymentService.findAll(orderId);
    }

    // GET /payments/:id
    // @Param mengambil bagian :id dari URL
    @Get(':id')
    getPaymentById(@Param('id') id: string) {
        return this.paymentService.findOne(id);
    }

    // POST /payments
    // @Body mengambil isi JSON yang dikirim client, lalu divalidasi oleh DTO
    @Post()
    createPayment(@Body() payment: CreatePaymentDto) {
        return this.paymentService.create(payment);
    }

    // PATCH /payments/:id/status
    // PATCH dipakai karena hanya mengubah sebagian data (statusnya saja)
    @Patch(':id/status')
    updatePaymentStatus(@Param('id') id: string, @Body() status: UpdatePaymentStatusDto) {
        return this.paymentService.updateStatus(id, status);
    }

    // DELETE /payments/:id
    @Delete(':id')
    deletePayment(@Param('id') id: string) {
        return this.paymentService.delete(id);
    }
}