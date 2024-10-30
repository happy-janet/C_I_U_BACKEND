import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ManualAssessmentService } from './addAssessment.service';
import { CreatemanualAssessmentDto } from './dto/create-addAssessment.dto';
import { UpdatemanualAssessmentDto } from './dto/update-addAssessment.dto';

@Controller('manualAssessment')
export class ManualAssessmentController {
  constructor(private readonly manualAssessmentService: ManualAssessmentService) {}

  // CREATE
  @Post()
  async create(@Body() createAddAssessmentDto: CreatemanualAssessmentDto) {
    return this.manualAssessmentService.create(createAddAssessmentDto);
  }

  // FIND ALL (Assessments with Questions)
  @Get('with-questions')
  async findAllWithQuestions() {
    return this.manualAssessmentService.findAllWithQuestions();
  }

  // FIND ALL (Assessments without Questions)
  @Get('assessments-only')
  async findAllAssessmentsOnly() {
    return this.manualAssessmentService.findAllAssessmentsOnly();
  }

  // FIND ALL (Questions Only)
  @Get('questions-only')
  async findAllQuestionsOnly() {
    return this.manualAssessmentService.findAllQuestionsOnly();
  }

  // FIND ONE BY ID (Assessment with Questions)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.manualAssessmentService.findOne(+id);
  }

  // UPDATE
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAddAssessmentDto: UpdatemanualAssessmentDto,
  ) {
    return this.manualAssessmentService.update(+id, updateAddAssessmentDto);
  }

  // DELETE
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.manualAssessmentService.remove(+id);
  }
}
