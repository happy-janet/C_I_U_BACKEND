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

  async createNotification(userId: number, title: string, message: string, eventType: string) {
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

  async notifyStudentsForEvent(eventType: string, title: string, message: string, courseId?: number) {
    const studentsToNotify = courseId
      ? await this.prisma.users.findMany({
          where: { courseId: courseId, role: 'student' },
        })
      : await this.prisma.users.findMany({ where: { role: 'student' } });

    const notifiedUserIds = new Set<number>();

    for (const student of studentsToNotify) {
      if (!notifiedUserIds.has(student.id)) {
        await this.createNotification(student.id, title, message, eventType);
        notifiedUserIds.add(student.id);
      }
    }
  }

  async notifyForCalendarEvent(userId: number, eventTitle: string) {
    const message = `Upcoming event: ${eventTitle}`;
    await this.createNotification(userId, eventTitle, message, 'CalendarEvent');
  }
}
