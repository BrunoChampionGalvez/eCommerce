import { Body, Controller, Delete, FileTypeValidator, Get, HttpCode, MaxFileSizeValidator, Param, ParseFilePipe, ParseUUIDPipe, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { AuthGuard } from "src/guards/auth.guard";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./products.entity";
import { Repository } from "typeorm";
import { CreateProductDto } from "src/dtos/products/CreateProduct.dto";
import { UpdateProductDto } from "src/dtos/products/UpdateProduct.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { RolesGuard } from "src/guards/roles.guard";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "src/enums/Role";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";

@ApiTags('Products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @HttpCode(200)
    @Get()
    async getProducts(@Query('page') page: string, @Query('limit') limit: string) {
        if (!page) page = "1"
        if (!limit) limit = "5"
        return await this.productsService.getProducts(Number(page), Number(limit))
    }

    @HttpCode(200)
    @Get(':id')
    async getProductById(@Param('id', ParseUUIDPipe) id: string) {
        return await this.productsService.getProductById(id)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @HttpCode(201)
    @Post()
    async createProduct(@Body() product: CreateProductDto) {
        return await this.productsService.createProduct(product)
    }

    @ApiBearerAuth()
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(200)
    @Put(':id')
    async updateProduct(@Param('id', ParseUUIDPipe) id: string, @Body() product: UpdateProductDto) {
        return await this.productsService.updateProduct(id, product)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Put('uploadImage/:id')
    @HttpCode(200)
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Subir imagen',
        type: 'multipart/form-data',
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        }
    })
    @UseInterceptors(FileInterceptor('image'))
    async uploadImage(
        @Param('id') id: string,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({
                        maxSize: 200000,
                        message: 'La imagen debe ser menor a 200kb.'
                    }),
                    new FileTypeValidator({
                        fileType: /jpg|jpeg|png|webp/,
                    })
                ]
            })
        ) file: Express.Multer.File) {
        return await this.productsService.uploadImage(id, file)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @HttpCode(200)
    @Delete(':id')
    async deleteProduct(@Param('id', ParseUUIDPipe) id: string) {
        return await this.productsService.deleteProduct(id)
    }

    @HttpCode(201)
    @Post('seeder')
    async addProducts() {
        return await this.productsService.addProducts()
    }
}