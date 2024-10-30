import {
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { NotificationService } from '../notification/notification.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async createNotification(
    @Body() createNotificationDto: CreateNotificationDto,
  ) {
    return this.notificationService.createNotification(
      createNotificationDto.userId,
      createNotificationDto.title,
      createNotificationDto.message,
      createNotificationDto.eventType,
    );
  }

  @Get(':userId')
  async getNotifications(@Param('userId') userId: string) {
    const parsedUserId = parseInt(userId, 10);
    if (isNaN(parsedUserId)) {
      throw new BadRequestException('Invalid userId');
    }
    console.log(`Fetching notifications for userId: ${parsedUserId}`);
    return this.notificationService.getNotificationsForUser(parsedUserId);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') notificationId: number) {
    return this.notificationService.markNotificationAsRead(notificationId);
  }
}
