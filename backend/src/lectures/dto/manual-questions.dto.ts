import { IsNotEmpty, IsString, IsInt, IsArray, IsDateString, IsOptional, Matches, ValidateNested } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { QuestionManualDto} from './UpdateManualAssessment.dto';
import * as moment from 'moment';


// Helper class for time validation
export class TimeDto {
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: 'Time must be in HH:MM:SS format',
  })
  time: string;
}


// DTO for creating a new manual assessment
export class CreateManualAssessmentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @Transform(({ value }) => parseInt(value))
  courseId: number;

  @IsString()
  @IsNotEmpty()
  courseUnit: string;

  @IsString()
  @IsNotEmpty()
  courseUnitCode: string;

  @IsInt()
  @Transform(({ value }) => parseInt(value))
  duration: number;

  @IsNotEmpty()
  @IsDateString()
  @Transform(({ value }) => {
    // Transform the date string to ISO format
    const date = moment(value).format('YYYY-MM-DD');
    return date;
  })
  scheduledDate: string;

  // @IsNotEmpty()
  // @Transform(({ value }) => {
  //   // Ensure time is in HH:MM:SS format
  //   const time = moment(value, 'HH:mm:ss').format('HH:mm:ss');
  //   if (time === 'Invalid date') {
  //     throw new Error('Invalid time format. Use HH:MM:SS');
  //   }
  //   return time;
  // })
  // startTime: string;

  // @IsNotEmpty()
  // @Transform(({ value }) => {
  //   // Ensure time is in HH:MM:SS format
  //   const time = moment(value, 'HH:mm:ss').format('HH:mm:ss');
  //   if (time === 'Invalid date') {
  //     throw new Error('Invalid time format. Use HH:MM:SS');
  //   }
  //   return time;
  // })
  // endTime: string;

  @IsString()
  @IsNotEmpty()
  createdBy: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionManualDto)
  questions: QuestionManualDto[];
}




export class CreateQuestionManualDto {
  @IsString()
  @IsNotEmpty()
  questions: string;

  @IsNotEmpty()
  options: any[]; // Assuming options can be an array of strings or objects

  @IsNotEmpty()
  correctAnswer: any; // Correct answer can be a string or object, based on your structure
}



export class UpdateQuestionManualDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  questions?: string;

  @IsOptional()
  options?: any[];

  @IsOptional()
  correctAnswer?: any;
}


