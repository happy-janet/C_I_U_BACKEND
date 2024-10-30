// import { Controller, Post, Body, Get, Param, InternalServerErrorException } from '@nestjs/common';
// import { ChatService } from './chat.service';
// import { CreateMessageDto } from '../dto/create-message.dto';

// @Controller('chat')
// export class ChatController {
//   constructor(private chatService: ChatService) {}

//   @Post('start')
//   async startChat(@Body() body: { participants: number[] }) {
//     return this.chatService.getOrCreateChat(body.participants);
//   }

//   @Get(':chatId/messages')
//   async getChatMessages(@Param('chatId') chatId: number) {
//     return this.chatService.getChatMessages(chatId);
//   }

//   @Post('messages')
//   async sendMessage(@Body() createMessageDto: CreateMessageDto) {
//     try {
//       return await this.chatService.createMessage(createMessageDto);
//     } catch (error) {
//       throw new InternalServerErrorException('Failed to send message');
//     }
//   }
// }


import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  // Get all messages for a specific chat
  @Get(':chatId/messages')
  async getMessages(@Param('chatId') chatId: number) {
    return this.chatService.getMessages(chatId);
  }

  
}
