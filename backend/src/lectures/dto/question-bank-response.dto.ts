// dto/question-bank-response.dto.ts
export class QuestionBankResponseDto {
    id: number;
    title: string;
    courseUnit: string;
    courseUnitCode: string;
    courseName: string;
    questionCount: number;
    createdBy: string;
    createdAt: Date;
  }