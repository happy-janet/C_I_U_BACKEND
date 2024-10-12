import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('start')
  async startChat(@Body() body: { participants: number[] }) {
    return this.chatService.getOrCreateChat(body.participants);
  }

  @Get(':chatId/messages')
  async getChatMessages(@Param('chatId') chatId: number) {
    return this.chatService.getChatMessages(chatId);
  }
}
