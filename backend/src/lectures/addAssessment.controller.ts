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

  // FIND ALL
  @Get()
  async findAll() {
    return this.manualAssessmentService.findAll();
  }

  // FIND ONE BY ID
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
