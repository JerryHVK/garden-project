import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEmail, IsNumber, IsOptional } from "class-validator";

export class SignupUserDTO{

    @ApiProperty({example: 'Khang'})
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({example: 'khang@gmail.com'})
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({description: 'You should provide a strong password, with number, letter and special character'})
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({example: 'Hai Ba Trung, Ha Noi', required: false})
    @IsString()
    @IsOptional()
    address: string;
}