import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersService } from "src/users/users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/users/users.entity";
import { JwtModule } from "@nestjs/jwt";
import { config as dotenvConfig} from "dotenv"

dotenvConfig({path: '.development.env'})

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: {expiresIn: '1h'}
        })
    ],
    providers: [AuthService, UsersService],
    controllers: [AuthController]
})
export class AuthModule {
    
}