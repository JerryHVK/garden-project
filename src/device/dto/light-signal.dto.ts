import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class LightSignalDto {
    @ApiProperty({example: "2", required: true})
    @IsNumber()
    @IsNotEmpty()
    gardenId: number;

    @ApiProperty({example: "false", required: false})
    @IsBoolean()
    @IsOptional()
    redOn: boolean;

    @ApiProperty({example: "true", required: false})
    @IsBoolean()
    @IsOptional()
    yellowOn: boolean;

    @ApiProperty({example: "true", required: false})
    @IsBoolean()
    @IsOptional()
    greenOn: boolean;
}