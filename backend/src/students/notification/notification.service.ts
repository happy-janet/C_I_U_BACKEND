// import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../../../prisma/prisma.service';

// @Injectable()
// export class NotificationService {
//   constructor(private readonly prisma: PrismaService) {}

//   async createNotification(userId: number, content: string) {
//     return this.prisma.notification.create({
//       data: {
//         userId,
//         content, // Only include content
//       },
//     });
//   }

//   async getUserNotifications(userId: number) {
//     return this.prisma.notification.findMany({
//       where: { userId },
//       orderBy: { createdAt: 'desc' },
//     });
//   }

//   async markAsRead(notificationId: number) {
//     // Remove the read property, or if you want to implement a similar functionality,
//     // consider updating another field that exists in the Notification model.
//     return this.prisma.notification.update({
//       where: { id: notificationId },
//       data: {
//         // You might want to remove this if no other update is needed
//         // If you have a similar field like 'status', you can use that
//       },
//     });
//   }
// }

