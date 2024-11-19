import { Module, forwardRef } from '@nestjs/common';
import { NotificationService } from '../notification/notification.service';
import { NotificationController } from '../notification/notification.controller';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotificationGateway } from '../notification/notification.gateway';

@Module({
  providers: [
    NotificationService,
    PrismaService,
    NotificationGateway,
  ],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
