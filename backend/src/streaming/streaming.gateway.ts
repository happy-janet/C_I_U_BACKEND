import {
    WebSocketGateway,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
  } from '@nestjs/websockets';
  import { Socket } from 'socket.io';
  
  @WebSocketGateway(3001, { cors: { origin: '*' } })
  export class StreamingGateway
    implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
  {
    // Handle a new client connection
    handleConnection(client: Socket) {
      console.log(`Client connected: ${client.id}`);
    }
  
    // Handle a client disconnecting
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
    }
  
    // Initialize the WebSocket server
    afterInit() {
      console.log('WebSocket server initialized');
    }
  
    // Handle incoming video stream data from the client
    @SubscribeMessage('video-stream')
    handleVideoStream(@MessageBody() data: Buffer, @ConnectedSocket() socket: Socket) {
      // Validate that the incoming data is a Buffer and not empty
      if (data && Buffer.isBuffer(data) && data.length > 0) {
        console.log(`Received video stream of length: ${data.length} bytes`);
        
        // Broadcast the video data to all other connected clients (except the sender)
        socket.broadcast.emit('video-stream', data);
      } else {
        // Log an error if the data is invalid
        console.log('Received empty or invalid video stream data');
      }
    }
  }
  


// // src/streaming/streaming.gateway.ts
// import {
//     WebSocketGateway,
//     OnGatewayConnection,
//     OnGatewayDisconnect,
//     OnGatewayInit,
//     SubscribeMessage,
//     MessageBody,
//     ConnectedSocket,
//   } from '@nestjs/websockets';
//   import { Socket } from 'socket.io';
  
//   @WebSocketGateway(3001, { cors: { origin: '*' } })
//   export class StreamingGateway
//     implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
//   {
//     handleConnection(client: Socket) {
//       console.log('Client connected:', client.id);
//     }
  
//     handleDisconnect(client: Socket) {
//       console.log('Client disconnected:', client.id);
//     }
  
//     afterInit() {
//       console.log('WebSocket server initialized');
//     }
  
//     @SubscribeMessage('video-stream')
//     handleVideoStream(@MessageBody() data: Buffer, @ConnectedSocket() socket: Socket) {
//       // Broadcast the video data to all other clients (except the sender)
//       socket.broadcast.emit('video-stream', data);
//     }
//   }
  