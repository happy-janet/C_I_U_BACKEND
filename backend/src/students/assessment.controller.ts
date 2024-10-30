// import { Controller, Get, Post, Body, Param, Query, Request } from '@nestjs/common';
// import { AssessmentService } from './assessment.service';
// import { ManualAssessmentService } from '../lectures/addAssessment.service';

// @Controller('assessments')
// export class AssessmentController {
//     constructor(
//         private readonly assessmentService: AssessmentService,
//         // private readonly manualAssessmentService: ManualAssessmentService,
//     ) {}

//     // Endpoint to get upcoming exams for a specific student
//     // @Get('student/:studentId/upcoming-exams')
//     // async findUpcomingExams(@Param('studentId') studentId: string) {
//     //     return this.manualAssessmentService.findUpcomingExams(+studentId);
//     // }

//     // Endpoint to get exams for a specific student
//     @Get('student/:studentId')
//     async getExamsForStudent(@Param('studentId') studentId: number) {
//         return this.assessmentService.getExamsForStudent(studentId);
//     }

//     // Endpoint to get a specific question for an assessment
//     @Get(':assessmentId/question')
//     async getQuestionForAssessment(
//         @Param('assessmentId') assessmentId: number,
//         @Query('index') questionIndex: number,
//     ) {
//         return this.assessmentService.getQuestionForAssessment(assessmentId, questionIndex);
//     }

//     // Endpoint to submit an exam
//     @Post(':assessmentId/submit')
//     async submitExam(
//         @Request() req,
//         @Param('assessmentId') assessmentId: number,
//         @Body() body: { answers: Record<string, any> },
//     ) {
//         const studentId = req.user.id; // Assuming you're using some authentication middleware
//         return this.assessmentService.submitExam(studentId, assessmentId, body.answers);
//     }

//     // Endpoint to get exam rules for a specific assessment
//     @Get(':assessmentId/rules')
//     async getExamRules(@Param('assessmentId') assessmentId: number) {
//         return this.assessmentService.getExamRules(assessmentId);
//     }
// }
