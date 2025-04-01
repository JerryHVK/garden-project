import { Module } from '@nestjs/common';
import { DeviceGateway } from './device.gateway';
import { DeviceController } from './device.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { DeviceService } from './device.service';
import { GardensModule } from 'src/gardens/gardens.module';
import { SensorDataModule } from 'src/sensor-data/sensor-data.module';

@Module({
  imports: [
    GardensModule,
    ClientsModule.registerAsync([
      {
        name: "MQTT_SERVICE",
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.MQTT,
          options: {
            url: configService.get<string>('MQTT_BROKER_URL')
          }
        })
      }
    ]),
    SensorDataModule
  ],
  controllers: [DeviceController],
  providers: [DeviceGateway, DeviceService]
})
export class DeviceModule {}
