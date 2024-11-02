// src/exam/dto/create-exam-progress.dto.ts
export class CreateExamProgressDto {
    studentId: number;
    examId: number;
    currentQuestion: number;
    answers: any; // JSON object of answers
    timeSpent: number;
    status:  'in-progress' | 'completed';
  }
  
  // src/exam/dto/resume-exam.dto.ts
  export class ResumeExamDto {
    studentId: number;
    examId: number;
    status: 'in-progress' | 'completed';
  }
  