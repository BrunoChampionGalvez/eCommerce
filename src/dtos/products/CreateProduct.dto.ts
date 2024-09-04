import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString, IsUrl, MaxLength } from "class-validator"

export class CreateProductDto {
    @ApiProperty({
        name: 'name',
        description: 'String que contenga máximo 30 caractéres.',
        example: 'Test Product'
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(30)
    name: string

    @ApiProperty({
        name: 'description',
        description: 'String que contenga máximo 80 caractéres.',
        example: 'Test description.'
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(80)
    description: string

    @ApiProperty({
        name: 'price',
        description: 'Número.',
        example: 500
    })
    @IsNotEmpty()
    @IsNumber()
    price: number

    @ApiProperty({
        name: 'stock',
        description: 'Número.',
        example: 100
    })
    @IsNotEmpty()
    @IsNumber()
    stock: number

    @ApiProperty({
        name: 'imgUrl',
        description: 'String que sea una URL de la imagen del producto.',
        example: 'http://www.test-example-imageurl.com'
    })
    @IsNotEmpty()
    @IsString()
    @IsUrl()
    imgUrl: string
}