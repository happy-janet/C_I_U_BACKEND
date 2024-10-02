import { Module } from '@nestjs/common';
import { LecturesService } from './lectures.service';
import { LecturesController } from './lectures.controller';
import { PrismaModule } from '../../prisma/prisma.module'; 
// Ensure the correct import path

@Module({
  imports: [PrismaModule], // Import PrismaModule here
  providers: [LecturesService],
  controllers: [LecturesController],
})
export class LecturesModule {}
