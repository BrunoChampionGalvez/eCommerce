import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsOptional, IsString, IsUrl, MaxLength } from "class-validator"

export class UpdateProductDto {
    @ApiProperty({
        name: 'name',
        description: 'String que contenga máximo 30 caractéres.',
        example: 'Test Product'
    })
    @IsOptional()
    @IsString()
    @MaxLength(30)
    name?: string

    @ApiProperty({
        name: 'description',
        description: 'String que contenga máximo 80 caractéres.',
        example: 'Test description.'
    })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    description?: string

    @ApiProperty({
        name: 'price',
        description: 'Número.',
        example: 500
    })
    @IsOptional()
    @IsNumber()
    price?: number

    @ApiProperty({
        name: 'stock',
        description: 'Número.',
        example: 100
    })
    @IsOptional()
    @IsNumber()
    stock?: number

    @ApiProperty({
        name: 'imgUrl',
        description: 'String que sea una URL de la imagen del producto.',
        example: 'http://www.test-example-imageurl.com'
    })
    @IsOptional()
    @IsString()
    @IsUrl()
    imgUrl?: string
}