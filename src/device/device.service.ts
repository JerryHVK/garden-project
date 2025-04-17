import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LightSignalDto } from './dto/light-signal.dto';
import { ResponseObject } from 'src/common/response-object';
import { GardensService } from 'src/gardens/gardens.service';
import { Role } from 'src/common/role.enum';

@Injectable()
export class DeviceService {
  constructor(
    @Inject('MQTT_SERVICE') private client: ClientProxy,
    private gardensService: GardensService
  ){}

  async controlLight(user: any, lightSignalDto: LightSignalDto){
    const garden = await this.gardensService.checkExistingGarden(lightSignalDto.gardenId);
    if(user.role == Role.Admin){
      if(!garden){
        return new ResponseObject(HttpStatus.BAD_REQUEST, "Invalid gardenId");
      }
    }
    else if(user.role == Role.User){
      if(!garden || garden.userId != user.id){
        return new ResponseObject(HttpStatus.BAD_REQUEST, "Invalid gardenId");
      }
    }
    else{
      return new ResponseObject(HttpStatus.BAD_REQUEST, "What is your role?");
    }
    
    const topic = "device/" + lightSignalDto.gardenId.toString() + "/control";
    // check topic
    // console.log("controlling topic: " + topic);
    await this.client.emit(topic, lightSignalDto);
    return new ResponseObject(HttpStatus.OK, "success");
  }
}
