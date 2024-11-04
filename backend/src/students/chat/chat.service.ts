// import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../../../prisma/prisma.service';

// @Injectable()
// export class ChatService {
//   constructor(private prisma: PrismaService) {}

//   async createMessage(chatId: number, senderId: number, content: string) {
//     return await this.prisma.message.create({
//       data: {
//         chatId,
//         senderId,
//         content,
//       },
//     });
//   }

//   async getMessages(chatId: number) {
//     return await this.prisma.message.findMany({
//       where: { chatId },
//       orderBy: { createdAt: 'asc' },
//     });
//   }
// }

// import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
// import { PrismaService } from '../../../prisma/prisma.service';

// @Injectable()
// export class ChatService {
//   constructor(private prisma: PrismaService) {}

//   // Create a new message, only if chat is between admin and student
//   async createMessage(chatId: number, senderId: number, content: string) {
//     // Check if chat exists and retrieve participants
//     const chat = await this.prisma.chat.findUnique({
//       where: { id: chatId },
//       include: { participants: true },
//     });

//     if (!chat) {
//       throw new NotFoundException('Chat not found');
//     }

//     // Ensure chat is specifically between an admin and a student
//     const hasAdmin = chat.participants.some(user => user.role === 'admin');
//     const hasStudent = chat.participants.some(user => user.role === 'student');

//     if (!hasAdmin || !hasStudent || chat.participants.length !== 2) {
//       throw new BadRequestException('Messages can only be sent in chats between an admin and a student');
//     }

//     // If validation passes, create the message
//     return await this.prisma.message.create({
//       data: {
//         chatId,
//         senderId,
//         content,
//       },
//     });
//   }

//   // Retrieve messages for a specific chat
//   async getMessages(chatId: number) {
//     return await this.prisma.message.findMany({
//       where: { chatId },
//       orderBy: { createdAt: 'asc' },
//     });
//   }
// }
