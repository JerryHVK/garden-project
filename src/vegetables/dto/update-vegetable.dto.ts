import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateVegetableDto {

  @ApiProperty({example: "cabbage", required: false})
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({example: "17", required: false})
  @IsNumber()
  @IsOptional()
  inQuantity: number;

  @ApiProperty({example: "12", required: false})
  @IsNumber()
  @IsOptional()
  saleQuantity: number;

}