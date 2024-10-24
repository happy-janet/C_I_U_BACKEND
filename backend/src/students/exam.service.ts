import { Injectable } from '@nestjs/common';
import { PrismaService } from '../.././prisma/prisma.service';

@Injectable()
export class ExamService {
  constructor(private readonly prisma: PrismaService) {}

  async getUpcomingExamsForStudent(userId: number) {
    const student = await this.prisma.users.findUnique({
      where: { id: userId },
      include: {
        registeredCourses: {
          include: {
            addAssessments: {
              where: {
                scheduledDate: {
                  gte: new Date(), // Fetch exams from today onwards
                },
              },
            },
            manualAssessments: {
              where: {
                scheduledDate: {
                  gte: new Date(),
                },
              },
            },
          },
        },
      },
    });

    if (!student) {
      throw new Error('Student not found');
    }

    const upcomingExams = student.registeredCourses.flatMap(course => [
      ...course.addAssessments,
      ...course.manualAssessments,
    ]);

    // Sort exams by scheduled date
    upcomingExams.sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());

    return upcomingExams;
  }
}
