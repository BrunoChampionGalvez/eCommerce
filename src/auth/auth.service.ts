import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { SignInAuthDto } from "src/dtos/users/SigninAuth.dto";
import { SignUpAuthDto } from "src/dtos/users/SignupAuth.dto";
import { UsersService } from "src/users/users.service";
import * as bcrypt from 'bcrypt'
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/users.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
        private readonly jwtService: JwtService
    ) {}

    getAuth() {
        return "Get all auth.";
    }

    async signIn(emailAndPassword: SignInAuthDto) {
        const { email, password } = emailAndPassword
        
        const user = await this.usersService.getUserByEmail(email)
        const isPasswordValid = bcrypt.compare(password, user.password)
        
        if (!user || !isPasswordValid) {
            throw new BadRequestException('Email y contraseña inválidos.')
        }
        
        const payload = {
            id: user.id,
            email: user.email
        }

        const token = this.jwtService.sign(payload)

        return {message: 'Usuario logueado.', token}
    }

    async signUp(user: SignUpAuthDto) {
        const newUser = await this.usersService.getUserByEmail(user.email)

        if (newUser) {
            throw new BadRequestException('Email en uso.')
        }

        if (user.password !== user.confirmPassword) {
            throw new BadRequestException('Las contraseñas deben ser iguales.')
        }

        const hashedPassword = await bcrypt.hash(user.password, 10)

        if (!hashedPassword) {
            throw new InternalServerErrorException('Error al hashear la contraseña.')
        }

        user.password = hashedPassword

        await this.usersRepository.save(user)

        return {message: 'Usuario registrado.'}
    }
}