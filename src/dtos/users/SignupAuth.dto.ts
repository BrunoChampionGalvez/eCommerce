import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsNumber, IsString, Matches, MaxLength, MinLength } from "class-validator"

export class SignUpAuthDto {
    @ApiProperty({
        name: 'name',
        description: 'String con mínimo 3 y máximo 80 caractéres.',
        example: 'Test Name'
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(80)
    @Matches(/^[a-zA-Z]+$/)
    name: string

    @ApiProperty({
        name: 'email',
        description: 'String con formato de email válido.',
        example: 'example@mail.com'
    })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string

    @ApiProperty({
        name: 'password',
        description: 'String de mínimo 8 y máximo 15 caractéres, con al menos una letra minúscula, una letra mayúscula, un número y un carácter especial.',
        example: 'Manzana#123'
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(15)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
    password: string

    @ApiProperty({
        name: 'confirmPassword',
        description: 'Mismo string que el ingresado en propiedad password.',
        example: 'Manzana#123'
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(15)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
    confirmPassword: string
    
    @ApiProperty({
        name: 'address',
        description: 'String de mínimo 3 y máximo 80 caractéres.',
        example: 'Test address'
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(80)
    address: string

    @ApiProperty({
        name: 'phone',
        description: 'Número de teléfono.',
        example: 123456789
    })
    @IsNotEmpty()
    @IsNumber()
    phone: number

    @ApiProperty({
        name: 'country',
        description: 'País de residencia.',
        example: 'Argentina'
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(20)
    country: string

    @ApiProperty({
        name: 'city',
        description: 'Ciudad de residencia.',
        example: 'Buenos Aires'
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(20)
    city: string
}