// import {
//   Controller,
//   Get,
//   Param,
//   Post,
//   Body,
//   BadRequestException,
//   InternalServerErrorException,
// } from '@nestjs/common';
// import { NotificationService } from './notification.service';

// @Controller('notifications')
// export class NotificationController {
//   constructor(private notificationService: NotificationService) {}

//   @Get('user/:userId')
//   async getUserNotifications(@Param('userId') userId: string) {
//     // Convert userId to number
//     const id = parseInt(userId, 10);
//     if (isNaN(id)) {
//       throw new BadRequestException('Invalid user ID');
//     }

//     try {
//       const notifications = await this.notificationService.getUserNotifications(id);
//       return {
//         status: 'success',
//         data: notifications,
//       };
//     } catch (error) {
//       // Handle the error appropriately
//       throw new InternalServerErrorException('Failed to retrieve notifications');
//     }
//   }

//   // Method to create notifications
//   @Post('create')
//   async createNotification(
//     @Body() createNotificationDto: { userId: number; content: string }
//   ) {
//     return this.notificationService.createNotification(createNotificationDto.userId, createNotificationDto.content);
//   }
// }

import { Controller, Post, Get, Param, Patch, Body } from '@nestjs/common';
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
  async getNotifications(@Param('userId') userId: number) {
    return this.notificationService.getNotificationsForUser(userId);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') notificationId: number) {
    return this.notificationService.markNotificationAsRead(notificationId);
  }
}
