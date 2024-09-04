import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './orders.entity';
import { User } from 'src/users/users.entity';
import { Product } from 'src/products/products.entity';
import { OrderDetail } from 'src/orderDetails/orderDetails.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, Product, OrderDetail])],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}
