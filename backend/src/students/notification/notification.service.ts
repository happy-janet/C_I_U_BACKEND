// import { Injectable, forwardRef, Inject } from '@nestjs/common';
// import { PrismaService } from '../../../prisma/prisma.service';
// import { NotificationGateway } from '../notification/notification.gateway';

// @Injectable()
// export class NotificationService {
//   constructor(
//     private readonly prisma: PrismaService,
//     @Inject(forwardRef(() => NotificationGateway)) 
//     private readonly notificationGateway: NotificationGateway,
//   ) {}

//   async createNotification(userId: number, title: string, message: string, eventType: string) {
//     const user = await this.prisma.users.findUnique({ where: { id: userId } });
//     if (!user) {
//       throw new Error(`User with ID ${userId} does not exist`);
//     }

//     const notification = await this.prisma.notification.create({
//       data: {
//         title,
//         message,
//         userId,
//         eventType,
//       },
//     });

//     this.notificationGateway.sendNotification(userId, title, message, eventType);
//     return notification;
//   }

//   async getNotificationsForUser(userId: number) {
//     console.log(`Getting notifications for userId: ${userId}`);
//     return this.prisma.notification.findMany({
//       where: { userId },
//       orderBy: { createdAt: 'desc' },
//     });
//   }

//   async markNotificationAsRead(notificationId: number) {
//     return this.prisma.notification.update({
//       where: { id: notificationId },
//       data: { read: true },
//     });
//   }

//   async notifyStudentsForCourseEvent(eventType: string, title: string, message: string, courseId: number) {
    
//     const students = await this.prisma.users.findMany({
//       where: {
//         courseId: courseId,
//         role: 'student',
//       },
//     });
 
//     for (const student of students) {
//       await this.createNotification(student.id, title, message, eventType);
//     }

//     if (eventType === 'systemUpdate') {
//       const allStudents = await this.prisma.users.findMany({ where: { role: 'student' } });
//       for (const student of allStudents) {
//         await this.createNotification(student.id, title, message, eventType);
//       }
//     }
//   }
// }

import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotificationGateway } from '../notification/notification.gateway';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => NotificationGateway))
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async createNotification(
    userId: number,
    title: string,
    message: string,
    eventType: string,
  ) {
    const user = await this.prisma.users.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error(`User with ID ${userId} does not exist`);
    }

    const notification = await this.prisma.notification.create({
      data: {
        title,
        message,
        userId,
        eventType,
      },
    });

    this.notificationGateway.sendNotification(userId, title, message, eventType);
    return notification;
  }

  async getNotificationsForUser(userId: number) {
    
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markNotificationAsRead(notificationId: number) {
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  }

  async notifyStudentsForCourseEvent(
    eventType: string,
    title: string,
    message: string,
    courseId: number,
  ) {
    // Fetch students based on eventType
    const studentsToNotify =
      eventType === 'systemUpdate'
        ? await this.prisma.users.findMany({ where: { role: 'student' } })
        : await this.prisma.users.findMany({
            where: {
              courseId: courseId,
              role: 'student',
            },
          });

    const notifiedUserIds = new Set<number>();

    for (const student of studentsToNotify) {
      if (!notifiedUserIds.has(student.id)) {
        await this.createNotification(student.id, title, message, eventType);
        notifiedUserIds.add(student.id);
      }
    }
  }
}
