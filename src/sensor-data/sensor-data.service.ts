import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SaveSensorDataDto } from './dto/save-sensor-data.dto';

@Injectable()
export class SensorDataService {
  constructor(private prisma: PrismaService){}

  async saveData(saveSensorDataDto: SaveSensorDataDto){
    await this.prisma.sensorData.create({
      data: {
        gardenId: saveSensorDataDto.gardenId,
        temperature: saveSensorDataDto.temperature,
        humidity: saveSensorDataDto.humidity
      }
    })
  }
}
