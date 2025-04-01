import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LightSignalDto } from './dto/light-signal.dto';
import { ResponseObject } from 'src/common/response-object';
import { GardensService } from 'src/gardens/gardens.service';

@Injectable()
export class DeviceService {
  constructor(
    @Inject('MQTT_SERVICE') private client: ClientProxy,
    private gardensService: GardensService
  ){}

  async controlLight(user: any, topic: string, lightSignalDto: LightSignalDto){
    const garden = await this.gardensService.checkExistingGarden(lightSignalDto.gardenId);
    if(!garden || garden.userId != user.id){
      return new ResponseObject(HttpStatus.BAD_REQUEST, "Invalid gardenId");
    }
    await this.client.emit(topic, lightSignalDto);
    return new ResponseObject(HttpStatus.OK, "success");
  }
}
