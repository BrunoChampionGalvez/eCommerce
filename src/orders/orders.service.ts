import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './orders.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/users.entity';
import { Product } from 'src/products/products.entity';
import { OrderDetail } from 'src/orderDetails/orderDetails.entity';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order) private readonly ordersRepository: Repository<Order>,
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
        @InjectRepository(Product) private readonly productsRepository: Repository<Product>,
        @InjectRepository(OrderDetail) private readonly orderDetailsRepository: Repository<OrderDetail>
    ) { }

    async getOrder(id: string) {
        const order = await this.ordersRepository.findOne({ where: { id: id }, relations: ['user', 'orderDetail', 'orderDetail.products'] })
        if (order) return order
        throw new NotFoundException('Orden no encontrada.')
    }

    async addOrder(order) {
        const { userId, products } = order
        const user = await this.usersRepository.findOneBy({ id: userId })
        let createdOrder: Order
        if (user) {
            const {password, ...noUserPassword} = user
            const now = new Date()
            const date = now.getDate()
            const month = now.getMonth()
            const year = now.getFullYear()
            const newNow = `${date}/${month}/${year}`
            createdOrder = this.ordersRepository.create({ date: newNow, user: noUserPassword })
            let total = 0
            let newProducts = []
            // console.log(products);
            
            for (const product of products) {
                // console.log(product);
                
                const newProduct = await this.productsRepository.findOne({ where: { id: product.id }, relations: {category: true}})
                if (newProduct) {
                    // console.log(newProduct);
                    
                    total += Number(newProduct.price)
                    newProduct.stock = newProduct.stock - 1
                    newProducts.push(newProduct)
                } else throw new NotFoundException('Al menos uno de los productos no fue encontrado.')
            }
            
            if (newProducts.length > 0) {
                const savedOrder = await this.ordersRepository.save(createdOrder)
                if (savedOrder) {
                    const createdOrderDetail = this.orderDetailsRepository.create({ price: total, products: newProducts})

                    await this.orderDetailsRepository.save(createdOrderDetail)

                    for (const product of newProducts) {
                        await this.productsRepository.save(product)
                    }

                    savedOrder.orderDetail = createdOrderDetail;
                    await this.ordersRepository.save(savedOrder);

                    return savedOrder
                }
            }
        } else throw new NotFoundException('Usuario no encontrado.')
    }
}
