import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

export class LightSignalDto {
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