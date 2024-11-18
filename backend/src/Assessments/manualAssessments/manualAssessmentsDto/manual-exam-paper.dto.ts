import { IsArray, IsDateString, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateExamPaperDto {
    title: string;
    description?: string;
    courseUnit: string;
    duration: string;
    scheduledDate: string; // Can be a string that can be parsed as Date
    startTime: string; // Can be a string that can be parsed as Date
    endTime: string; // Can be a string that can be parsed as Date
    createdBy: string;
    courseUnitCode: string;
    courseId: number; // Ensure this field exists in the database
    status?: string; // Optional status field
    isDraft?: boolean; // Optional boolean property to indicate draft status
    @IsArray() // Ensure this is an array
    questions: CreateQuestionDto[];
  }
  
  export class CreateQuestionDto {
    questionNumber: number;
    content: string;
    answer: string;
    options: string; 
  }
  export class UpdateQuestionDto {
    content: string;
    answer?: string;
    options?: string; 
  }
  
  




