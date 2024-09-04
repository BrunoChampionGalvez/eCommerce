import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from 'src/dtos/orders/CreateOrder.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }
    
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Get(':id')
    async getOrder(@Param('id', ParseUUIDPipe) id: string) {
        return await this.ordersService.getOrder(id)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Post()
    async addOrder(@Body() order: CreateOrderDto) {
        return await this.ordersService.addOrder(order)
    }
}
