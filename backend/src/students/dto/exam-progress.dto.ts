export class UpdateExamProgressDto {
  isCompleted?: boolean;
  addAssessmentId?: number;
  manualAssessmentId?: number;
}

export class ResumeExamDto {
  addAssessmentId?: number;
  manualAssessmentId?: number;
}
