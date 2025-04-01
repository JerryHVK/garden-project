import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LightSignalDto } from './dto/light-signal.dto';
import { ResponseObject } from 'src/common/response-object';

@Injectable()
export class DeviceService {
  constructor(
    @Inject('MQTT_SERVICE') private client: ClientProxy
  ){}

  async controlLight(topic: string, lightSignalDto: LightSignalDto){
    await this.client.emit(topic, lightSignalDto);
    return new ResponseObject(HttpStatus.OK, "success");
  }
}
