import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateVegetableDto {
    @ApiProperty({example: "cabbage", required: true})
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({example: "13", required: true})
    @IsNumber()
    @IsNotEmpty()
    gardenId: number;

    @ApiProperty({example: "17", required: false})
    @IsNumber()
    @IsOptional()
    inQuantity: number;

    @ApiProperty({example: "12", required: false})
    @IsNumber()
    @IsOptional()
    saleQuantity: number;

    @ApiProperty({example: "12.3", required: false})
    @IsNumber()
    @IsOptional()
    price: number;
}