import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { PrismaModule } from '../../../prisma/prisma.module';
import { ChatController } from '../chat/chat.controller';

@Module({
  imports: [PrismaModule],
  providers: [ChatService, ChatGateway],
  exports: [ChatService], 
  controllers: [ChatController],
})
export class ChatModule {}

