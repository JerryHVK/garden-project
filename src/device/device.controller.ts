import { Body, Controller, Get, Post } from '@nestjs/common';
import { Ctx, MessagePattern, MqttContext, Payload } from '@nestjs/microservices';
import { Public } from 'src/auth/decorators/public.decorator';
import { DeviceGateway } from './device.gateway';
import { ApiBearerAuth } from '@nestjs/swagger';
import { DeviceService } from './device.service';
import { LightSignalDto } from './dto/light-signal.dto';

@Controller('device')
export class DeviceController {
  constructor(
    private deviceGateway: DeviceGateway, 
    private deviceService: DeviceService
  ){

  }
  private static sub_topic: string;

  @Public()
  @MessagePattern('device/data/sub')
  handleComingMessageFromBroker(@Payload() data, @Ctx() context: MqttContext){
    this.deviceGateway.emitDataToClient(data);
  }

  @ApiBearerAuth()
  @Public()
  @Post('light')
  controlLight(@Body() lightSignalDto: LightSignalDto) {
    this.deviceService.controlLight('device/data/pub', lightSignalDto);
  }
}
