import { Module } from '@nestjs/common';
import { VegetablesController } from './vegetables.controller';
import { VegetablesService } from './vegetables.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { GardensModule } from 'src/gardens/gardens.module';

@Module({
  imports: [GardensModule],
  controllers: [VegetablesController],
  providers: [VegetablesService, PrismaService],
  exports: [VegetablesService]
})
export class VegetablesModule {}
