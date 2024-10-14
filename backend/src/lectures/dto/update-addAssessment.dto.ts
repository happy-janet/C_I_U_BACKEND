import { IsString, IsInt, IsNotEmpty, IsArray, IsDate } from 'class-validator';

export class UpdatemanualAssessmentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsInt()
  courseId: number;

  @IsString()
  courseUnit: string;

  @IsString()
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

  @IsArray()
  questions: string[];

  @IsArray()
  options: string[];

  @IsArray()
  objectives: string[];

  @IsString()
  correctAnswer: string;
}
