// // manual-assessment.service.ts
// import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
// import { PrismaService } from '../../prisma/prisma.service';
// import { UpdateManualAssessmentDto, QuestionManualDto } from './dto/UpdateManualAssessment.dto';
// import { CreateManualAssessmentDto} from './dto/manual-questions.dto';
// import * as moment from 'moment';

// @Injectable()
// export class ManualAssessmentService {
//   constructor(private readonly prisma: PrismaService) {}

//   async createManualAssessment(dto: CreateManualAssessmentDto) {
//     try {
//       // Combine date and time for datetime fields
//       const baseDate = moment(dto.scheduledDate).format('YYYY-MM-DD');
//       const scheduledDate = moment(`${baseDate} ${dto.startTime}`).toDate();
//       const startTime = moment(`${baseDate} ${dto.startTime}`).toDate();
//       const endTime = moment(`${baseDate} ${dto.endTime}`).toDate();

//       // Validate time order
//       if (moment(startTime).isAfter(endTime)) {
//         throw new BadRequestException('Start time must be before end time');
//       }

//       return await this.prisma.manualAssessment.create({
//         data: {
//           title: dto.title,
//           description: dto.description,
//           courseId: dto.courseId,
//           courseUnit: dto.courseUnit,
//           courseUnitCode: dto.courseUnitCode,
//           duration: dto.duration,
//           scheduledDate,
//           startTime,
//           endTime,
//           createdBy: dto.createdBy,
//           questions: {
//             create: dto.questions.map(q => ({
//               questions: q.questions,
//               options: q.options,
//               correctAnswer: q.correctAnswer,
//             })),
//           },
//         },
//         include: {
//           questions: true,
//         },
//       });
//     } catch (error) {
//       if (error.code === 'P2002') {
//         throw new BadRequestException('Assessment with this title already exists');
//       }
//       throw error;
//     }
//   }

//   async getAllAssessments() {
//     const assessments = await this.prisma.manualAssessment.findMany({
//       include: {
//         questions: true,
//       },
//     });

//     return assessments.map(assessment => ({
//       ...assessment,
//       scheduledDate: moment(assessment.scheduledDate).format('YYYY-MM-DD'),
//       startTime: moment(assessment.startTime).format('HH:mm:ss'),
//       endTime: moment(assessment.endTime).format('HH:mm:ss'),
//     }));
//   }

//   async getManualAssessmentWithoutQuestions(id: number) {
//     const assessment = await this.prisma.manualAssessment.findUnique({
//       where: { id },
//     });

//     if (!assessment) {
//       throw new NotFoundException('Assessment not found');
//     }

//     return {
//       ...assessment,
//       scheduledDate: moment(assessment.scheduledDate).format('YYYY-MM-DD'),
//       startTime: moment(assessment.startTime).format('HH:mm:ss'),
//       endTime: moment(assessment.endTime).format('HH:mm:ss'),
//     };
//   }

//   async getManualAssessmentById(id: number) {
//     const assessment = await this.prisma.manualAssessment.findUnique({
//       where: { id },
//       include: {
//         questions: true,
//       },
//     });

//     if (!assessment) {
//       throw new NotFoundException('Assessment not found');
//     }

//     return {
//       ...assessment,
//       scheduledDate: moment(assessment.scheduledDate).format('YYYY-MM-DD'),
//       startTime: moment(assessment.startTime).format('HH:mm:ss'),
//       endTime: moment(assessment.endTime).format('HH:mm:ss'),
//     };
//   }

//   async getSpecificQuestion(assessmentId: number, questionId: number) {
//     const question = await this.prisma.questionManual.findFirst({
//       where: {
//         id: questionId,
//         assessmentId,
//       },
//     });

//     if (!question) {
//       throw new NotFoundException('Question not found');
//     }

//     return question;
//   }

//   async deleteAllQuestions(id: number) {
//     const assessment = await this.prisma.manualAssessment.findUnique({
//       where: { id },
//     });

//     if (!assessment) {
//       throw new NotFoundException('Assessment not found');
//     }

//     await this.prisma.questionManual.deleteMany({
//       where: { assessmentId: id },
//     });

//     return { message: 'All questions deleted successfully' };
//   }

//   async deleteManualAssessment(id: number) {
//     const assessment = await this.prisma.manualAssessment.findUnique({
//       where: { id },
//     });

//     if (!assessment) {
//       throw new NotFoundException('Assessment not found');
//     }

//     // First delete all related questions
//     await this.prisma.questionManual.deleteMany({
//       where: { assessmentId: id },
//     });

//     // Then delete the assessment
//     await this.prisma.manualAssessment.delete({
//       where: { id },
//     });

//     return { message: 'Assessment deleted successfully' };
//   }

//   async updateManualAssessment(id: number, dto: UpdateManualAssessmentDto) {
//     const assessment = await this.prisma.manualAssessment.findUnique({
//       where: { id },
//     });

//     if (!assessment) {
//       throw new NotFoundException('Assessment not found');
//     }

//     const updateData: any = { ...dto };

//     // Handle datetime fields if they exist in the update
//     if (dto.scheduledDate || dto.startTime || dto.endTime) {
//       const baseDate = dto.scheduledDate 
//         ? moment(dto.scheduledDate).format('YYYY-MM-DD')
//         : moment(assessment.scheduledDate).format('YYYY-MM-DD');

//       if (dto.startTime) {
//         updateData.startTime = moment(`${baseDate} ${dto.startTime}`).toDate();
//       }
//       if (dto.endTime) {
//         updateData.endTime = moment(`${baseDate} ${dto.endTime}`).toDate();
//       }
//       if (dto.scheduledDate) {
//         updateData.scheduledDate = moment(`${baseDate} ${moment(assessment.startTime).format('HH:mm:ss')}`).toDate();
//       }

//       // Validate time order
//       const finalStartTime = updateData.startTime || assessment.startTime;
//       const finalEndTime = updateData.endTime || assessment.endTime;
//       if (moment(finalStartTime).isAfter(finalEndTime)) {
//         throw new BadRequestException('Start time must be before end time');
//       }
//     }

//     const updated = await this.prisma.manualAssessment.update({
//       where: { id },
//       data: updateData,
//       include: {
//         questions: true,
//       },
//     });

//     return {
//       ...updated,
//       scheduledDate: moment(updated.scheduledDate).format('YYYY-MM-DD'),
//       startTime: moment(updated.startTime).format('HH:mm:ss'),
//       endTime: moment(updated.endTime).format('HH:mm:ss'),
//     };
//   }

//   async updateQuestion(assessmentId: number, questionId: number, dto: QuestionManualDto) {
//     // First, verify that the assessment exists
//     const assessment = await this.prisma.manualAssessment.findUnique({
//       where: { id: assessmentId },
//       include: {
//         questions: {
//           where: { id: questionId }
//         }
//       }
//     });

//     if (!assessment) {
//       throw new NotFoundException(`Assessment with ID ${assessmentId} not found`);
//     }

//     // Check if the question exists and belongs to this assessment
//     if (assessment.questions.length === 0) {
//       throw new NotFoundException(
//         `Question with ID ${questionId} not found in assessment ${assessmentId}`
//       );
//     }

//     // Update the question
//     return await this.prisma.questionManual.update({
//       where: {
//         id: questionId,
//         assessmentId: assessmentId, // This ensures the question belongs to the specified assessment
//       },
//       data: {
//         questions: dto.questions,
//         options: dto.options,
//         correctAnswer: dto.correctAnswer,
//       }
//     });
//   }

// }