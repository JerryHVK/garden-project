import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { VegetablesModule } from 'src/vegetables/vegetables.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { GardensService } from 'src/gardens/gardens.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [VegetablesModule],
  providers: [SalesService, PrismaService, GardensService, UserService],
  controllers: [SalesController]
})
export class SalesModule {}
