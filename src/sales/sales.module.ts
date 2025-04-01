import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { VegetablesModule } from 'src/vegetables/vegetables.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [VegetablesModule],
  providers: [SalesService, PrismaService],
  controllers: [SalesController]
})
export class SalesModule {}
