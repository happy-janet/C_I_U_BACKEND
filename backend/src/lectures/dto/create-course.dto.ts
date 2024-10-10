export class CreateCourseDto {
  facultyName: string;
  courseName: string;
  courseUnits: string[];  // Matches the schema field
  courseUnitCode: string; // Matches the schema field
}
