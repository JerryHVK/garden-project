import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateVegetablePriceDto {
    @ApiProperty({example: "12.3", required: true})
    @IsNumber()
    @IsNotEmpty()
    price: number;
}