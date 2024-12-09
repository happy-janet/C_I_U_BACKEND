// src/issue-report/dto/report-issue.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class ReportIssueDto {
  @IsString()
  @IsNotEmpty()
  regno: string;

  @IsString()
  @IsNotEmpty()
  issueDescription: string;
}
