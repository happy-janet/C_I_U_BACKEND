// import { IsArray, IsDateString, IsInt, IsNotEmpty, IsString } from 'class-validator';

// export class QuestionManual {
//   @IsInt()
//   id: number; // This can be optional if you're not expecting an ID for new questions

//   @IsString()
//   @IsNotEmpty()
//   questionText: string;

//   @IsArray() // Assuming options is an array
//   options: string[];

//   @IsString()
//   @IsNotEmpty()
//   correctAnswer: string;
//   questions: any;

//   // Other fields as necessary
// }

// export class CreatemanualAssessmentDto {
//   @IsString()
//   @IsNotEmpty()
//   title: string;

//   @IsString()
//   @IsNotEmpty()
//   description: string;

//   @IsInt()
//   courseId: number;

//   @IsString()
//   @IsNotEmpty()
//   courseUnit: string;

//   @IsString()
//   @IsNotEmpty()
//   courseUnitCode: string;

//   @IsInt()
//   duration: number; // in minutes

//   @IsDateString()
//   scheduledDate: Date;

//   @IsDateString()
//   startTime: Date;

//   @IsDateString()
//   endTime: Date;

//   @IsString()
  



//   // @IsDateString()
//   // createdAt?: Date;

//   // @IsDateString()
//   // updatedAt?: Date;

//   questions?: QuestionManual[]; // Assuming QuestionManual is defined elsewhere
// }

// export class QuestionManual {
//   id: number;
//   questionText: string;
//   options: any;
//   correctAnswer: any;
//   // other fields as necessary
// }
