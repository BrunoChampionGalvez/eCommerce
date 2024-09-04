import { Module } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./products.entity";
import { Category } from "src/categories/categories.entity";
import { RolesGuard } from "src/guards/roles.guard";
import { User } from "src/users/users.entity";
import { OrderDetail } from "src/orderDetails/orderDetails.entity";
import { Order } from "src/orders/orders.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Product, Category, User, OrderDetail, Order])],
    providers: [ProductsService],
    controllers: [ProductsController]
})
export class ProductsModule {}