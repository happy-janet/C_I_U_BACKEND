// src/issue-report/notification.gateway.ts
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Array to hold connected clients (e.g., admins)
  private admins: Set<any> = new Set();

  handleConnection(client: any) {
    this.admins.add(client);
  }

  handleDisconnect(client: any) {
    this.admins.delete(client);
  }

  // Update the method to accept both regno and issueDescription
  notifyAdmin(regno: string, issueDescription: string) {
    // Notify all admins with both regno and issue description
    this.admins.forEach((admin) => {
      admin.emit('issueReported', {
        regno,
        issueDescription,
      });
    });
  }
}
