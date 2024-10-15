// src/issue-report/issue-report.module.ts
import { Module } from '@nestjs/common';
import { IssueReportService } from './issue-report.service';
import { IssueReportController } from './issue-reprt.controller';
import { NotificationGateway } from './notification.gateway';
import { PrismaService } from '../../prisma/prisma.service'; // Adjust the import path as necessary

@Module({
  controllers: [IssueReportController],
  providers: [IssueReportService, NotificationGateway, PrismaService],
  exports: [IssueReportService], // Export IssueReportService to be used in other modules
})
export class IssueReportModule {}
