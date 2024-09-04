import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator"

export class UpdateUserDto {
    @ApiProperty({
        name: 'name',
        description: 'String con mínimo 3 y máximo 80 caractéres.',
        example: 'Test Name'
    })
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(80)
    name?: string

    @ApiProperty({
        name: 'email',
        description: 'String con formato de email válido.',
        example: 'example@mail.com'
    })
    @IsOptional()
    @IsString()
    @IsEmail()
    email?: string

    @ApiProperty({
        name: 'password',
        description: 'String de mínimo 8 y máximo 15 caractéres, con al menos una letra minúscula, una letra mayúscula, un número y un carácter especial.',
        example: 'Manzana#123'
    })
    @IsOptional()
    @IsString()
    @MinLength(8)
    @MaxLength(15)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
    password?: string

    @ApiProperty({
        name: 'address',
        description: 'String de mínimo 3 y máximo 80 caractéres.',
        example: 'Test address'
    })
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(80)
    address?: string

    @ApiProperty({
        name: 'phone',
        description: 'Número de teléfono.',
        example: 123456789
    })
    @IsOptional()
    @IsNumber()
    phone?: number

    @ApiProperty({
        name: 'country',
        description: 'País de residencia.',
        example: 'Argentina'
    })
    @IsOptional()
    @IsString()
    @MinLength(5)
    @MaxLength(20)
    country?: string

    @ApiProperty({
        name: 'city',
        description: 'Ciudad de residencia.',
        example: 'Buenos Aires'
    })
    @IsOptional()
    @IsString()
    @MinLength(5)
    @MaxLength(20)
    city?: string
}