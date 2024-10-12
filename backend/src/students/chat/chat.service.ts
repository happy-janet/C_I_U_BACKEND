import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';


@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createMessage(senderId: number, chatId: number, text: string) {
    return this.prisma.message.create({
      data: {
        senderId,
        chatId,
        text,
      },
    });
  }

  async getChatMessages(chatId: number) {
    return this.prisma.message.findMany({
      where: { chatId },
      include: { sender: true },
    });
  }

//   async getOrCreateChat(participants: number[]) {
//     const chat = await this.prisma.chat.findFirst({
//       where: {
//         participants: { some: { id: { in: participants } } },
//       },
//     });
//     if (chat) return chat;

//     return this.prisma.chat.create({
//       data: {
//         participants: {
//           connect: participants.map((id) => ({ id })),
//         },
//       },
//     });
//   }
// }
  async getOrCreateChat(participants: number[]) {
    // Check if users exist first
    const usersExist = await this.prisma.users.findMany({
      where: { id: { in: participants } },
      select: { id: true },
    });

    if (usersExist.length !== participants.length) {
      throw new Error('One or more users do not exist');
    }

    // Then proceed to find or create the chat
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