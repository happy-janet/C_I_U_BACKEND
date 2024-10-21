import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private admins = new Set();  // Track connected admins

  handleConnection(client: any) {
    // Log connection
    console.log('Admin connected:', client.id);

    // Register the admin when the event 'registerAdmin' is triggered
    client.on('registerAdmin', () => {
      console.log('Admin registered:', client.id);
      this.admins.add(client.id);  // Only add the admin once
    });
  }

  handleDisconnect(client: any) {
    console.log('Admin disconnected:', client.id);
    this.admins.delete(client.id);  // Remove admin on disconnect
  }

  // Notify all registered admins
  notifyAdmin(regno: string, issueDescription: string) {
    console.log('Notifying admins about:', regno, issueDescription);
    this.server.emit('issueReported', { regno, issueDescription });
  }
}
