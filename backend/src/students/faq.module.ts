// src/faq/faq.module.ts
import { Module } from '@nestjs/common';
import { FAQService } from './faq.service';
import { FAQController } from './faq.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from './auth.module'; // Ensure this path is correct

@Module({
  imports: [PrismaModule, AuthModule], // Include necessary modules
  providers: [FAQService],
  controllers: [FAQController],
  exports: [FAQService],
})
export class FaqModule {}
