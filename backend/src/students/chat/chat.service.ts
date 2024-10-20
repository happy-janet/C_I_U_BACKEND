import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateMessageDto } from '../dto/create-message.dto'; // Adjust the path as necessary

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createMessage(createMessageDto: CreateMessageDto) {
    const { senderId, receiverId, chatId, text } = createMessageDto;

    return this.prisma.message.create({
      data: {
        senderId,
        receiverId, // Include the receiverId
        chatId,
        text,
      },
    });
  }

  async getChatMessages(chatId: number) {
    return this.prisma.message.findMany({
      where: { chatId },
      include: { sender: true, receiver: true }, // Include receiver in the response if needed
    });
  }

  async getOrCreateChat(participants: number[]) {
    const usersExist = await this.prisma.users.findMany({
      where: { id: { in: participants } },
      select: { id: true },
    });

    if (usersExist.length !== participants.length) {
      throw new Error('One or more users do not exist');
    }

    const chat = await this.prisma.chat.findFirst({
      where: {
        participants: {
          every: { id: { in: participants } },
        },
      },
    });

    if (chat) return chat;

    return this.prisma.chat.create({
      data: {
        participants: {
          connect: participants.map((id) => ({ id })),
        },
      },
    });
  }
}
