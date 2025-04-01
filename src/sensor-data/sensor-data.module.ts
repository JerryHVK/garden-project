import { Module } from '@nestjs/common';
import { SensorDataService } from './sensor-data.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [SensorDataService, PrismaService],
  exports: [SensorDataService]
})
export class SensorDataModule {}
