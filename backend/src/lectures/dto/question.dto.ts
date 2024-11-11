// dto/question.dto.ts
export class CreateQuestionDto {
    content: string;
    options: string[];  // Array for multiple choice options
    answer?: string;
    assessmentId: number;
    questionNumber: number;
  }
  
  export class UpdateQuestionDto {
    content?: string;
    options?: string[];
    answer?: string;
  }
  