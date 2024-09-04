import { Body, Controller, Get, Headers, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInAuthDto } from "src/dtos/users/SigninAuth.dto";
import { SignUpAuthDto } from "src/dtos/users/SignupAuth.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    
    @Get()
    getAuth() {
        return this.authService.getAuth()
    }

    @Post('signin')
    async signIn(@Body() emailAndPassword: SignInAuthDto) {
        const isLoggedIn = await this.authService.signIn(emailAndPassword) 
        return isLoggedIn
    }

    @Post('signup')
    async signUp(@Body() user: SignUpAuthDto) {
        return await this.authService.signUp(user)
    }
}