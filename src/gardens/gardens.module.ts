import { Module } from '@nestjs/common';
import { GardensController } from './gardens.controller';
import { GardensService } from './gardens.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [GardensController],
  providers: [GardensService, PrismaService],
  exports: [GardensService]
})
export class GardensModule {}
