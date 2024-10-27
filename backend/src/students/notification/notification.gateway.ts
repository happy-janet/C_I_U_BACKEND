import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationService } from '../notification/notification.service';
import { Inject, forwardRef } from '@nestjs/common';

@WebSocketGateway({ cors: true })
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    @Inject(forwardRef(() => NotificationService)) // Use forwardRef here
    private readonly notificationService: NotificationService,
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  async sendNotification(userId: number, title: string, message: string, eventType: string) {
    const notification = await this.notificationService.createNotification(
      userId,
      title,
      message,
      eventType,
    );

    this.server.to(`user_${userId}`).emit('newNotification', notification);
  }

  // Use this method to join users to a specific room on client connection.
  joinUserRoom(client: Socket, userId: number) {
    client.join(`user_${userId}`);
  }
}
