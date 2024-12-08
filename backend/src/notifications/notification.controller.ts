import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('event')
  async notifyEvent(
    @Body() body: { eventType: string; title: string; message: string },
  ) {
    const { eventType, title, message } = body;

    if (!eventType || !title || !message) {
      throw new BadRequestException(
        'eventType, title, and message are required',
      );
    }

    return this.notificationService.notifyStudentsForEvent(eventType, title, message);
  }

  @Get()
  async getAllNotifications() {
  console.log('GET /notifications route hit');  
  const notifications = await this.notificationService.getAllNotifications();
  console.log('Fetched notifications:', notifications);
  return notifications;
}

  @Patch(':id/read')
  async markAsRead(@Param('id') notificationId: number) {
    return this.notificationService.markNotificationAsRead(notificationId);
  }
}
