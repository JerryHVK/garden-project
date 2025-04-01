import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class SaveSensorDataDto {
    @ApiProperty({example: "2", required: true})
    @IsNumber()
    @IsNotEmpty()
    gardenId: number;

    @ApiProperty({example: "27.3", required: true})
    @IsNumber()
    @IsNotEmpty()
    temperature: number;

    @ApiProperty({example: "45.6", required: true})
    @IsNumber()
    @IsNotEmpty()
    humidity: number;
}