import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class SaveTransactionDto {
    @ApiProperty({example: "12", required: true})
    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @ApiProperty({example: "52.32", required: true})
    @IsNumber()
    @IsNotEmpty()
    totalPrice: number;

    @ApiProperty({example: "72", required: true})
    @IsNumber()
    @IsNotEmpty()
    vegetableId: number;
}