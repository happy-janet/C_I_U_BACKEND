// // manual-assessment.controller.ts
// import { 
//   Controller, 
//   Post, 
//   Body, 
//   Param, 
//   Delete, 
//   Get, 
//   Patch, 
//   ParseIntPipe,
//   HttpStatus,
//   HttpCode 
// } from '@nestjs/common';
// import { ManualAssessmentService } from '../lectures/manualquestion.service';
// import { UpdateManualAssessmentDto, QuestionManualDto } from './dto/UpdateManualAssessment.dto';
// import { CreateManualAssessmentDto} from './dto/manual-questions.dto';
// import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

// @ApiTags('Manual Assessments')
// @Controller('manual-assessments')
// export class ManualAssessmentController {
//   constructor(private readonly manualAssessmentService: ManualAssessmentService) {}

//   @Post()
//   @ApiOperation({ summary: 'Create a new manual assessment' })
//   @ApiResponse({ status: HttpStatus.CREATED, description: 'Assessment created successfully' })
//   @HttpCode(HttpStatus.CREATED)
//   async create(@Body() createDto: CreateManualAssessmentDto) {
//     return this.manualAssessmentService.createManualAssessment(createDto);
//   }

//   @Get()
//   @ApiOperation({ summary: 'Get all manual assessments' })
//   async getAllAssessments() {
//     return this.manualAssessmentService.getAllAssessments();
//   }

//   @Get(':id/no-questions')
//   @ApiOperation({ summary: 'Get assessment without questions' })
//   async getManualAssessmentWithoutQuestions(@Param('id', ParseIntPipe) id: number) {
//     return this.manualAssessmentService.getManualAssessmentWithoutQuestions(id);
//   }

//   @Get(':id')
//   @ApiOperation({ summary: 'Get assessment with questions' })
//   async getManualAssessmentById(@Param('id', ParseIntPipe) id: number) {
//     return this.manualAssessmentService.getManualAssessmentById(id);
//   }

//   @Get(':assessmentId/questions/:questionId')
//   @ApiOperation({ summary: 'Get specific question' })
//   async getSpecificQuestion(
//     @Param('assessmentId', ParseIntPipe) assessmentId: number,
//     @Param('questionId', ParseIntPipe) questionId: number
//   ) {
//     return this.manualAssessmentService.getSpecificQuestion(assessmentId, questionId);
//   }

//   @Delete(':id/questions')
//   @ApiOperation({ summary: 'Delete all questions in assessment' })
//   @HttpCode(HttpStatus.NO_CONTENT)
//   async deleteAllQuestions(@Param('id', ParseIntPipe) id: number) {
//     return this.manualAssessmentService.deleteAllQuestions(id);
//   }

//   @Delete(':id')
//   @ApiOperation({ summary: 'Delete assessment' })
//   @HttpCode(HttpStatus.NO_CONTENT)
//   async deleteManualAssessment(@Param('id', ParseIntPipe) id: number) {
//     return this.manualAssessmentService.deleteManualAssessment(id);
//   }

//   @Patch(':id')
//   @ApiOperation({ summary: 'Update assessment' })
//   async updateManualAssessment(
//     @Param('id', ParseIntPipe) id: number,
//     @Body() updateDto: UpdateManualAssessmentDto,
//   ) {
//     return this.manualAssessmentService.updateManualAssessment(id, updateDto);
//   }

//   @Patch(':assessmentId/questions/:questionId')
//   async updateQuestion(
//     @Param('assessmentId', ParseIntPipe) assessmentId: number,
//     @Param('questionId', ParseIntPipe) questionId: number,
//     @Body() questionDto: QuestionManualDto,
//   ) {
//     return this.manualAssessmentService.updateQuestion(
//       assessmentId,
//       questionId,
//       questionDto
//     );
//   }
// }