// import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { NotificationService } from './notification.service';

// @WebSocketGateway(3000, {
//   cors: {
//     origin: '*',
//     methods: ['GET', 'POST'],
//   },
// })
// export class NotificationGateway {
//   @WebSocketServer()
//   server: Server;

//   constructor(private notificationService: NotificationService) {}

//   // Notify user of a new notification in real-time
//   async sendNotification(userId: number, notification: any) {
//     this.server.to(`user_${userId}`).emit('newNotification', notification);
//   }

//   // Handle user joining the notification room (when the user connects)
//   handleConnection(client: Socket) {
//     const userId = client.handshake.query.userId; // Get the user ID from the query
//     client.join(`user_${userId}`); // Join a room for the user
//   }
// }
