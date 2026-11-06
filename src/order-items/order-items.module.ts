import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './entity/entity-order-items.js';
import { OrderItemsController } from './order-items.controller.js';
import { OrderItemsService } from './order-items.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem])],
  controllers: [OrderItemsController],
  providers: [OrderItemsService]
})
export class OrderItemsModule {}
