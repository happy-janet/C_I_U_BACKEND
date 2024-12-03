// src/issue-report/issue-report.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { IssueReportService } from './issue-report.service';
import { IssueReport } from '@prisma/client';
import { ReportIssueDto } from './reportsDTO/report-issue.dto';

@Controller('issues')
export class IssueReportController {
  constructor(private readonly issueReportService: IssueReportService) {}

  @Post('report')
  async reportIssue(
    @Body() reportIssueDto: ReportIssueDto,
  ): Promise<IssueReport> {
    return this.issueReportService.reportIssue(reportIssueDto);
  }
}
