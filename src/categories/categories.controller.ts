import { Controller, Get, HttpCode, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @HttpCode(200)
    @Get()
    async getCategories() {
        return await this.categoriesService.getCategories()
    }

    @HttpCode(201)
    @Post('seeder')
    async addCategories() {
        return await this.categoriesService.addCategories()
    }
}
