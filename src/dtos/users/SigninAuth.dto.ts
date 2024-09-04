import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class SignInAuthDto {
    @ApiProperty({
        name: 'email',
        description: 'String con formato de email válido.',
        example: 'bruno@mail.com'
    })
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty({
        name: 'password',
        description: 'String que sea la contraseña de la cuenta con el email ingresado.',
        example: 'Pera#123'
    })
    @IsNotEmpty()
    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
    password: string
}