// import { Controller, Post, Body, BadRequestException } from '@nestjs/common';

// @Controller('chat')
// export class ChatController {
//   constructor(private chatService: ChatService) {}

//   // Get all messages for a specific chat
//   @Get(':chatId/messages')
//   async getMessages(@Param('chatId') chatId: number) {
//     return this.chatService.getMessages(chatId);
//   }

//   // Create a new chat between student and admin
//   @Post()
//   async createChat(@Body('participants') participants: number[]) {
//     if (participants.length !== 2) {
//       throw new BadRequestException('A chat must include exactly two participants.');
//     }
//     return this.chatService.createChat(participants);
//   }
// }
