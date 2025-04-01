import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateGardenDto {
    @ApiProperty({example: "Garden 01", required: false})
    @IsString()
    @IsNotEmpty()
    name: string;
}