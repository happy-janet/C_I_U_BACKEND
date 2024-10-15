// manual-assessment.dto.ts

import { IsDate, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreatemanualAssessmentDto {
  @IsInt()
  id: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  courseId: number;

  @IsString()
  @IsNotEmpty()
  courseUnit: string;

  @IsString()
  @IsNotEmpty()
  courseUnitCode: string;

  @IsInt()
  duration: number; // in minutes

  @IsDate()
  scheduledDate: Date;

  @IsDate()
  startTime: Date;

  @IsDate()
  endTime: Date;

  @IsInt()
  createdBy: number;

  @IsDate()
  createdAt?: Date;

  @IsDate()
  updatedAt?: Date;

  questions?: QuestionManual[]; // Assuming QuestionManual is defined elsewhere
}
