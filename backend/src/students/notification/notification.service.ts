import {
  Injectable,
  forwardRef,
  Inject,
  NotFoundException,
} from '@nestjs/common';
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
      throw new NotFoundException(`User with ID ${userId} does not exist`);
    }

    // Check if a similar notification already exists
    const existingNotification = await this.prisma.notification.findFirst({
      where: {
        userId,
        title,
        eventType,
        read: false, 
      },
    });

    if (existingNotification) {
      console.log(`Notification already exists for user ${userId}: ${title}`);
      return existingNotification;
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
    console.log(`Created new notification for user ${userId}: ${title}`);
    return notification;
  }

  
  async getAllNotifications() {
    const notifications = await this.prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
    });
    if (notifications.length === 0) {
      console.log('No notifications found.');
    }
    return notifications;
  }

  
  async markNotificationAsRead(notificationId: number) {
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  }

  
  async notifyStudentsForEvent(eventType: string, title: string, message: string) {
    const studentsToNotify = await this.prisma.users.findMany({
      where: { role: 'student' },
    });

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
