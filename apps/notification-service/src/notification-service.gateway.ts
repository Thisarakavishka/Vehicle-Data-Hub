import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationGateway {

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: any) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
  }
  
  sendNotification(data: { first100Rows: any[], totalRows: number, pageCount: number }) {
    console.log('Notification received:', data);
    this.server.emit('notification', data);
  }

  //Send message
  @SubscribeMessage('sendMessage')
  handleMessage(@MessageBody() message: string): void {
    this.server.emit('notification', message);
  }
}
