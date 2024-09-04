import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { AuthGuard } from "src/guards/auth.guard";
import { UpdateUserDto } from "src/dtos/users/UpdateUser.dto";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "src/enums/Role";
import { RolesGuard } from "src/guards/roles.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiBearerAuth()
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(200)
    @Get()
    async getUsers(@Query('page') page: string, @Query('limit') limit: string) {
        
        if (!page) page = "1"
        if (!limit) limit = "5"
        return await this.usersService.getUsers(Number(page), Number(limit));
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @HttpCode(200)
    @Get(':id')
    async getUserById(@Param('id', ParseUUIDPipe) id: string) {
        return await this.usersService.getUserById(id)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @HttpCode(200)
    @Put(':id')
    async updateUser(@Param('id', ParseUUIDPipe) id: string, @Body() user: UpdateUserDto) {
        return await this.usersService.updateUser(id, user)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @HttpCode(200)
    @Delete(':id')
    async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
        return await this.usersService.deleteUser(id)
    }

    @Put('changeRole/:id')
    @HttpCode(200)
    async changeRole(@Param('id') id: string) {
        return await this.usersService.changeRole(id)
    }
}