import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entity/entity-payments.js';
import { Order } from '../orders/entity/entity-orders.js';
import { PaymentsController } from './payments.controller.js';
import { PaymentsService } from './payments.service.js';

@Module({
  // forFeature mendaftarkan entity agar repository-nya bisa dipakai di module ini.
  // Order ikut didaftarkan karena service memakai repository pesanan.
  // Kalau lupa, muncul error "Nest can't resolve dependencies of the PaymentsService"
  imports: [TypeOrmModule.forFeature([Payment, Order])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}