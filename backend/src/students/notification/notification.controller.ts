import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get('user/:userId')
  async getUserNotifications(@Param('userId') userId: string) {
    // Convert userId to number
    const id = parseInt(userId, 10);
    if (isNaN(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    try {
      const notifications = await this.notificationService.getUserNotifications(id);
      return {
        status: 'success',
        data: notifications,
      };
    } catch (error) {
      // Handle the error appropriately
      throw new InternalServerErrorException('Failed to retrieve notifications');
    }
  }

  // Method to create notifications
  @Post('create')
  async createNotification(
    @Body() createNotificationDto: { userId: number; content: string }
  ) {
    return this.notificationService.createNotification(createNotificationDto.userId, createNotificationDto.content);
  }
}
