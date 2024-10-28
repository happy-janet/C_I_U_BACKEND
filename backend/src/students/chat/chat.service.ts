import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createMessage(chatId: number, senderId: number, content: string) {
    return await this.prisma.message.create({
      data: {
        chatId,
        senderId,
        content,
      },
    });
  }

  async getMessages(chatId: number) {
    return await this.prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
