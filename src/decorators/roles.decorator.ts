import { SetMetadata } from "@nestjs/common";
import { Role } from "src/enums/Role";

export const Roles = (...roles: Role[]) => {
    return SetMetadata('roles', roles)
}