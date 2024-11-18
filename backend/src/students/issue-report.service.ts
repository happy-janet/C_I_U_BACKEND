// src/issue-report/issue-report.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationGateway } from './notification.gateway';
import { IssueReport } from '@prisma/client';
import { ReportIssueDto } from './dto/report-issue.dto';

@Injectable()
export class IssueReportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async reportIssue(reportIssueDto: ReportIssueDto): Promise<IssueReport> {
    const { regno, issueDescription } = reportIssueDto;

    // Find student by registration number
    const student = await this.prisma.users.findUnique({
      where: { registrationNo: regno },
    });

    if (!student) {
      throw new Error('Student not found');
    }

    // Create the issue report in the database
    const issueReport = await this.prisma.issueReport.create({
      data: {
        regno,
        issueDescription,
        reportedAt: new Date(),
        studentId: student.id,
      },
    });

    // Notify connected admins
    this.notificationGateway.notifyAdmin(regno, issueDescription);

    return issueReport;
  }
}
