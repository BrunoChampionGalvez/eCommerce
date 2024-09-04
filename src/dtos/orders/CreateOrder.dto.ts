import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNotEmpty, IsUUID, ValidateNested } from "class-validator";
import { Category } from "src/categories/categories.entity";
import { OrderDetail } from "src/orderDetails/orderDetails.entity";
import { Product } from "src/products/products.entity";

export class CreateOrderDto {
    @ApiProperty({
        name: 'userId',
        description: 'String en formato UUID del usuario a quien pertenecerá la orden.',
        example: '54bfd495-31c4-4ac1-b64d-1ee1beea10b0'
    })
    @IsNotEmpty()
    @IsUUID()
    userId: string

    @ApiProperty({
        name: 'products',
        description: 'Array de objetos que contengan la propiedad id que sean los UUIDs de productos existentes.',
        example: [
            { id: 'e7603d62-f52b-42f1-99b3-437f883af136'}
        ]
    })
    @IsArray()
    @ArrayMinSize(1, { message: 'El arreglo de productos debe contener al menos 1 elemento.' })
    products: UUIDProduct[]
}

class UUIDProduct {
    id: string
}