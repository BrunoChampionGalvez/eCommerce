import { NotFoundException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./users.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt'
import { Role } from "src/enums/Role";

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {}

    async getUsers(page: number, limit: number) {
        const users = await this.usersRepository.find({relations: ['orders', 'orders.orderDetail', 'orders.orderDetail.products']})
        const usersNoPassword = []
        for (const user of users) {
            const { password, ...userNoPassword } = user
            usersNoPassword.push(userNoPassword)
        }
        const start = (page - 1) * limit
        const end = start + limit
        return usersNoPassword.slice(start, end)
    }

    async getUserById(id: string) {
        const user = await this.usersRepository.findOne({ where: { id }, relations: ['orders', 'orders.orderDetail', 'orders.orderDetail.products']})
        if (user) {
            const { password, roles, ...userNoPasswordNoRoles } = user
            return userNoPasswordNoRoles
        }
        throw new NotFoundException(`Usuario no encontrado.`)
    }

    async getUserByEmail(email: string) {
        return await this.usersRepository.findOneBy({email})
    }

    async updateUser(id: string, user) {
        const newUser = await this.usersRepository.findOneBy({ id })
        
        if (newUser) {
            await this.usersRepository.update({ id }, user)
            return { updated: true }
        }

        if (user.password) {
            const hashedPassword = await bcrypt.hash(user.password, 10)
            await this.usersRepository.update({ id }, {password: hashedPassword})
            return { updated: true }
        }

        throw new NotFoundException('Usuario no encontrado.')
    }

    async deleteUser(id: string) {
        const newUser = await this.usersRepository.findOneBy({ id })
        if (newUser) {
            await this.usersRepository.delete({ id })
            return {deleted: true}
        }
        throw new NotFoundException('Usuario no encontrado.')
    }

    async changeRole(id: string) {
        const user = await this.usersRepository.findOneBy({ id })
        if (!user) throw new NotFoundException('Usuario no encontrado.')
        user.roles = Role.Admin
        this.usersRepository.save(user)
        return 'Usuario asignado como admin exitosamente.'
    }
}