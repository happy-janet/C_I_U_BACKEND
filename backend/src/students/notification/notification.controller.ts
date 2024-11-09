import { Controller, Post, Get, Param, Patch, Body, BadRequestException } from '@nestjs/common';
import { NotificationService } from '../notification/notification.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // Test route to confirm controller registration
  @Get('check-test-route')
  async testRoute() {
    return { message: 'Controller is accessible' };
  }
  

  @Post('event')
  async notifyEvent(@Body() body: { eventType: string; title: string; message: string; courseId?: number }) {
    return this.notificationService.notifyStudentsForEvent(body.eventType, body.title, body.message, body.courseId);
  }

  @Get(':userId')
  async getNotifications(@Param('userId') userId: string) {
    const parsedUserId = parseInt(userId, 10);
    if (isNaN(parsedUserId)) {
      throw new BadRequestException('Invalid userId');
    }
    return this.notificationService.getNotificationsForUser(parsedUserId);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') notificationId: number) {
    return this.notificationService.markNotificationAsRead(notificationId);
  }
}

