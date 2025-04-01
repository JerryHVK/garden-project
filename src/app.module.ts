import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { GardensModule } from './gardens/gardens.module';
import { VegetablesModule } from './vegetables/vegetables.module';
import { ConfigModule } from '@nestjs/config';
import { DeviceModule } from './device/device.module';
import { SensorDataModule } from './sensor-data/sensor-data.module';
import { SalesModule } from './sales/sales.module';

@Module({
  imports: [
    AuthModule, 
    GardensModule, 
    VegetablesModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    DeviceModule,
    SensorDataModule,
    SalesModule],
})
export class AppModule {}
