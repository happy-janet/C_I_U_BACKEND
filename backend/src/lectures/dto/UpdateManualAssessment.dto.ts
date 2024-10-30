// update-manual-assessment.dto.ts
import { IsNotEmpty, IsString, IsInt, IsArray, IsDateString, IsOptional, Matches, ValidateNested } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import * as moment from 'moment';

// Helper class for time validation
export class TimeDto {
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: 'Time must be in HH:MM:SS format',
  })
  time: string;
}


//DTO for updating a manual assessment
export class UpdateManualAssessmentDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  courseId?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  courseUnit?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  courseUnitCode?: string;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  duration?: number;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => {
    if (!value) return undefined;
    const date = moment(value).format('YYYY-MM-DD');
    return date;
  })
  scheduledDate?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    const time = moment(value, 'HH:mm:ss').format('HH:mm:ss');
    if (time === 'Invalid date') {
      throw new Error('Invalid time format. Use HH:MM:SS');
    }
    return time;
  })
  startTime?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    const time = moment(value, 'HH:mm:ss').format('HH:mm:ss');
    if (time === 'Invalid date') {
      throw new Error('Invalid time format. Use HH:MM:SS');
    }
    return time;
  })
  endTime?: string;

  @IsOptional()
  @IsString()
  createdBy?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionManualDto)
  questions?: QuestionManualDto[];
}


// Base question DTO
export class QuestionManualDto {
  @IsString()
  @IsNotEmpty()
  questions: string;

  @IsArray()
  @IsNotEmpty()
  options: string[];

  @IsNotEmpty()
  correctAnswer: any;
}