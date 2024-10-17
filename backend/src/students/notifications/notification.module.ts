import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationGateway } from '../notification.gateway';
import { PrismaModule } from '../../../prisma/prisma.module';
import { NotificationController } from './notification.controller';

@Module({
  imports: [PrismaModule],
  providers: [NotificationService, NotificationGateway],
  controllers: [NotificationController],
  exports: [NotificationGateway], // Export NotificationGateway
})
export class NotificationModule {}
