import { Module } from '@nestjs/common';
import { VegetablesController } from './vegetables.controller';
import { VegetablesService } from './vegetables.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [VegetablesController],
  providers: [VegetablesService, PrismaService]
})
export class VegetablesModule {}
