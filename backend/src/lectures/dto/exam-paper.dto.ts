export class UploadExamPaperDto {
  title: string;
  description?: string;
  courseUnit: string;
  duration: string;
  scheduledDate: string; // Can be a string that can be parsed as Date
  startTime: string; // Can be a string that can be parsed as Date
  endTime: string; // Can be a string that can be parsed as Date
  createdBy: string;
  courseUnitCode: string;
  courseId: string; // Ensure this field exists in the database
  status?: string; // Optional status field
  isDraft?: boolean; // Optional boolean property to indicate draft status
}

export class UpdateQuestionDto {
  content: string;
  answer?: string;
  options?: string; // Optional if options are in the CSV
}


// Create a new interface for the frontend to use
export interface CourseDropdownData {
  id: number;
  courseName: string;
}

export interface CourseUnitData {
  courseUnits: string[];
  courseUnitCode: string;
}