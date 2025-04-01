import { ApiProperty } from '@nestjs/swagger';
import {  IsOptional, IsString } from 'class-validator';

export class UpdateGardenDto {
    @ApiProperty({example: "Garden 01", required: false})
    @IsString()
    @IsOptional()
    name: string;
}
