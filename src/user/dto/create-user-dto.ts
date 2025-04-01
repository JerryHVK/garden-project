import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEmail, IsNumber, IsOptional } from "class-validator";

export class CreateUserDTO{

    @ApiProperty({example: 'Khang'})
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty({example: 'khang@gmail.com'})
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @ApiProperty({description: 'You should provide a strong password, with number, letter and special character'})
    @IsString()
    @IsNotEmpty()
    readonly password: string;

    @ApiProperty({example: 'Hai Ba Trung, Ha Noi', required: false})
    @IsString()
    @IsOptional()
    readonly address: string;
}