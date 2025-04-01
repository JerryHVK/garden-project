import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { GardensService } from 'src/gardens/gardens.service';

@WebSocketGateway({transports: ['websocket']})
export class DeviceGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(private configService: ConfigService, private gardensService: GardensService){}
  
  static clients: { [key: number]: Socket } = {};

  @SubscribeMessage('authen')
  async handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket){
    // check if "data" object is not undefined and has the right format
    if(!data || !data.token || !data.gardenId){
      client.emit('fromServer', 'Please enter the right message form');
      return;
    }

    // check if there is "JWTSECRET" env variable in .env file
    const jwt_secret = this.configService.get<string>('JWTSECRET');
    if(!jwt_secret){
      client.emit('fromServer', "Internal Server Error");
      return;
    }

    // check if the token is valid
    let decoded;
    try {
      decoded = jwt.verify(data.token, jwt_secret);
    } catch (error) {
      client.emit('fromServer', 'Invalid token');
      return;
    }

    // check if the gardenId is valid, and that garden belongs to this user
    const userId = decoded.sub;
    const gardenId = data.gardenId;
    const garden = await this.gardensService.checkExistingGarden(gardenId);
    if(!garden || garden.userId != userId){
      client.emit('fromServer', 'Invalid gardenId');
      return;
    }

    // emit notification if authencating successfully
    client.emit('fromServer', 'Authenticated successfully');


    // save the client to the static array
    DeviceGateway.clients[gardenId] = client;
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log('Connected - clientId: ', client.id);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('Disconnected - clientId: ', client.id);
  }

  emitDataToClient(data: any){
    
    // check if there is any websocket client connect to receive data from the garden with this gardenId
    // kiểm tra xem có ws client nào kết nối với server, và đã xác thực với gardenId này hay chưa
    if(!DeviceGateway.clients[data.gardenId]){
      return;
    }

    // emit data to ws client
    DeviceGateway.clients[data.gardenId].emit('device-data', data);
  }

}
