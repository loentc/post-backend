import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    password: string

    @IsString()
    firstname: string

    @IsString()
    lastname: string
}
