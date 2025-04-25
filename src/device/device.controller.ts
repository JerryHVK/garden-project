import { Body, Controller, Get, Post, Request, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { Ctx, MessagePattern, MqttContext, Payload } from '@nestjs/microservices';
import { Public } from 'src/auth/decorators/public.decorator';
import { DeviceGateway } from './device.gateway';
import { ApiBearerAuth } from '@nestjs/swagger';
import { DeviceService } from './device.service';
import { LightSignalDto } from './dto/light-signal.dto';
import { SensorDataService } from 'src/sensor-data/sensor-data.service';
import { SaveSensorDataDto } from 'src/sensor-data/dto/save-sensor-data.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Controller('device')
export class DeviceController {
  constructor(
    private deviceGateway: DeviceGateway, 
    private deviceService: DeviceService,
    private sensorDataService: SensorDataService
  ){}

  @Public()
  @MessagePattern('device/+/data')
  // @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UsePipes(new ValidationPipe({ whitelist: true }))
  handleComingMessageFromBroker(@Payload() saveSensorDataDto: SaveSensorDataDto, @Ctx() context: MqttContext){
    // console.log(saveSensorDataDto);
    let subTopic;
    if(subTopic = Number.parseInt(context.getTopic().split('/')[1])){
      // console.log(subTopic);
      saveSensorDataDto.gardenId = subTopic;

      // save it to database
      this.sensorDataService.saveData(saveSensorDataDto);

      // send to websocket client
      this.deviceGateway.emitDataToClient(saveSensorDataDto);
    }
  }

  @ApiBearerAuth()
  @Post('light')
  controlLight(@Request() req, @Body() lightSignalDto: LightSignalDto) {
    // this.deviceService.controlLight(req.user, 'device/control', lightSignalDto);
    this.deviceService.controlLight(req.user, lightSignalDto);
  }
}
