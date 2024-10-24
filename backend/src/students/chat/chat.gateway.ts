// import {
//   WebSocketGateway,
//   WebSocketServer,
//   SubscribeMessage,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { ChatService } from '../chat/chat.service';
// import { CreateMessageDto } from '../dto/create-message.dto';

// @WebSocketGateway(3000, {
//   cors: {
//     origin: '*',
//     methods: ['GET', 'POST'],
//     transports: ['websocket'],
//   },
// })
// export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer()
//   server: Server;

//   constructor(private chatService: ChatService) {}

//   async handleConnection(client: Socket) {
//     console.log('Client connected: ', client.id);
//   }

//   handleDisconnect(client: Socket) {
//     console.log('Client disconnected: ', client.id);
//   }

//   @SubscribeMessage('sendMessage')
//   async handleSendMessage(client: Socket, payload: CreateMessageDto) {
//     const message = await this.chatService.createMessage(payload); // Pass the entire DTO
//     this.server.to(`chat_${payload.chatId}`).emit('newMessage', message);
//   }

//   @SubscribeMessage('joinChat')
//   async handleJoinChat(client: Socket, payload: { chatId: number }) {
//     client.join(`chat_${payload.chatId}`);
//   }
// }
