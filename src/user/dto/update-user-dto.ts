import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEmail, IsNumber, IsOptional } from "class-validator";

export class UpdateUserDTO{

    @ApiProperty({example: 'Khang'})
    @IsString()
    @IsOptional()
    readonly name: string;

    @ApiProperty({description: 'You should provide a strong password, with number, letter and special character'})
    @IsString()
    @IsOptional()
    readonly password: string;

    @ApiProperty({example: 'Hai Ba Trung, Ha Noi', required: false})
    @IsString()
    @IsOptional()
    readonly address: string;
}