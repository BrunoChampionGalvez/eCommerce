import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { Observable } from "rxjs";
import { Role } from "src/enums/Role";
import { User } from "src/users/users.entity";
import { Repository } from "typeorm";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector, @InjectRepository(User) private readonly usersRepository: Repository<User>) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()

        const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [context.getHandler(), context.getClass()])

        const user = await this.usersRepository.findOneBy({ id: request.user.id })

        const hasRole = () => requiredRoles.some((role) => user.roles === role)

        const valid = user.roles && hasRole()

        if (!valid) {
            throw new ForbiddenException('No tiene permisos para acceder a esta ruta.')
        }
        return valid
    }

}