// import { Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaService } from '../../prisma/prisma.service';
// import { QuestionManual } from '@prisma/client';

// @Injectable()
// export class AssessmentService {
//     constructor(private readonly prisma: PrismaService) {}

//     // Fetch exams for a specific student based on their enrolled courses
//     async getExamsForStudent(studentId: number) {
//         return this.prisma.manualAssessment.findMany({
//             where: {
//                 course: {
//                     students: {
//                         some: {
//                             id: studentId,
//                         },
//                     },
//                 },
//             },
//         });
//     }

//     // Fetch one question at a time for a specific assessment
//     async getQuestionForAssessment(assessmentId: number, questionIndex: number) {
//         const questions = await this.prisma.questionManual.findMany({
//             where: { assessmentId },
//             skip: questionIndex,
//             take: 1,
//         });

//         if (questions.length === 0) {
//             throw new NotFoundException('No more questions available');
//         }

//         return questions[0]; // Return the first question
//     }

//     // Submit an exam and calculate the grade
//     async submitExam(studentId: number, assessmentId: number, answers: Record<string, any>) {
//         const assessment = await this.prisma.manualAssessment.findUnique({
//             where: { id: assessmentId },
//             include: { questions: true },
//         });

//         if (!assessment) throw new NotFoundException('Assessment not found');

//         const score = this.calculateScore(answers, assessment.questions);
//         const percentage = (score / assessment.questions.length) * 100;

//         return this.prisma.submission.create({
//             data: {
//                 studentId,
//                 assessmentId,
//                 answers,
//                 score,
//                 percentage,
//                 submittedAt: new Date(),
//             },
//         });
//     }

//     // Retrieve exam rules for a specific assessment
//     async getExamRules(assessmentId: number) {
//         const assessment = await this.prisma.manualAssessment.findUnique({
//             where: { id: assessmentId },
//             select: { id: true, title: true, examRules: true },
//         });

//         if (!assessment) throw new NotFoundException('Assessment not found');

//         return { examRules: assessment.examRules };
//     }

//     // Helper method to calculate score based on answers
//     private calculateScore(answers: Record<string, any>, questions: QuestionManual[]) {
//         let score = 0;
//         questions.forEach((question) => {
//             if (answers[question.id] === question.correctAnswer) {
//                 score++;
//             }
//         });
//         return score;
//     }

//     // Fetch upcoming exams for a specific student
//     async findUpcomingExams(studentId: number) {
//         const currentDate = new Date(); // Get the current date and time
        
//         // Check if the student exists
//         const studentExists = await this.prisma.users.findUnique({
//             where: { id: studentId },
//         });

//         if (!studentExists) {
//             return []; // Return an empty array if the student doesn't exist
//         }

//         return this.prisma.manualAssessment.findMany({
//             where: {
//                 scheduledDate: { gte: currentDate }, // Only future assessments
//                 course: {
//                     students: { some: { id: studentId } }, // Filter by the student's enrolled courses
//                 },
//             },
//             select: {
//                 title: true,
//                 scheduledDate: true,
//                 startTime: true,
//                 endTime: true,
//                 course: {
//                     select: { courseName: true },
//                 },
//             },
//             orderBy: { scheduledDate: 'asc' }, // Sort exams by scheduled date
//         });
//     }
// }
