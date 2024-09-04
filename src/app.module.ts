import { Module, OnModuleInit } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import typeOrmConfig from './config/typeorm'
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CategoriesService } from './categories/categories.service';
import { ProductsService } from './products/products.service';
import { Category } from './categories/categories.entity';
import { Product } from './products/products.entity';
import { OrderDetail } from './orderDetails/orderDetails.entity';
import { Order } from './orders/orders.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => (configService.get('typeorm'))
    }),
    TypeOrmModule.forFeature([Category, Product, OrderDetail, Order]),
    UsersModule, ProductsModule, AuthModule, CategoriesModule, OrdersModule, CloudinaryModule],
  controllers: [],
  providers: [CategoriesService, ProductsService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly categoriesService: CategoriesService, private readonly productsService: ProductsService) {}

  async onModuleInit() {
    await this.seedData()
  }

  private async seedData() {
    await this.categoriesService.addCategories()
    await this.productsService.addProducts()
  }
}
