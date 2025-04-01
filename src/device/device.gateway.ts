import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({transports: ['websocket']})
export class DeviceGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  static clients: { [key: string]: Socket } = {};

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: any, @ConnectedSocket() client: Socket){
    console.log("Message from clientId ", client.id, ": ", message);
    client.emit('fromServer', message)
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log('Connected - clientId: ', client.id);
    DeviceGateway.clients[client.id] = client; // Lưu trữ clientId
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('Disconnected - clientId: ', client.id);
    // client.leave(DeviceGateway.room);
    delete DeviceGateway.clients[client.id];
  }

  emitDataToClient(data: any){
    for(let clientId in DeviceGateway.clients){
      DeviceGateway.clients[clientId].emit('device-data', data);
    }
  }

}
