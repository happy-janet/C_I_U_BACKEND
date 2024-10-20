import { Module } from '@nestjs/common';
import { NotificationService } from '../notification/notification.service';
import { NotificationGateway } from '../notification/notification.gateway';
import { NotificationController } from '../notification/notification.controller';
import { PrismaService } from '../../../prisma/prisma.service';

@Module({
  imports: [],
  providers: [NotificationService, NotificationGateway, PrismaService],
  controllers: [NotificationController],
})
export class NotificationModule {}
