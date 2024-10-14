import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatemanualAssessmentDto } from './dto/create-addAssessment.dto';
import { UpdatemanualAssessmentDto } from './dto/update-addAssessment.dto';

@Injectable()
export class ManualAssessmentService {
  constructor(private prisma: PrismaService) {}

 // CREATE
async create(data: CreatemanualAssessmentDto) {
    return this.prisma.manualAssessment.create({
      data: {
        title: data.title,
        description: data.description,
        courseId: data.courseId,
        courseUnit: data.courseUnit,
        courseUnitCode: data.courseUnitCode,
        duration: data.duration,
        scheduledDate: data.scheduledDate,
        startTime: data.startTime,
        endTime: data.endTime,
        createdBy: data.createdBy,
        questions: JSON.stringify(data.questions),
        options: JSON.stringify(data.options),
        objectives: JSON.stringify(data.objectives),  // Now recognized
        correctAnswer: data.correctAnswer,
      },
    });
  }
  // FIND ALL
  async findAll() {
    return this.prisma.manualAssessment.findMany();
  }

  // FIND ONE BY ID
  async findOne(id: number) {
    const assessment = await this.prisma.manualAssessment.findUnique({
      where: { id },
    });

    if (!assessment) {
      throw new NotFoundException(`Assessment with ID ${id} not found`);
    }

    return assessment;
  }

  // UPDATE
async update(id: number, data: UpdatemanualAssessmentDto) {
    const assessment = await this.findOne(id);
  
    return this.prisma.manualAssessment.update({
      where: { id },
      data: {
        title: data.title || assessment.title,
        description: data.description || assessment.description,
        courseId: data.courseId || assessment.courseId,
        courseUnit: data.courseUnit || assessment.courseUnit,
        courseUnitCode: data.courseUnitCode || assessment.courseUnitCode,
        duration: data.duration || assessment.duration,
        scheduledDate: data.scheduledDate || assessment.scheduledDate,
        startTime: data.startTime || assessment.startTime,
        endTime: data.endTime || assessment.endTime,
        createdBy: data.createdBy || assessment.createdBy,
        questions: data.questions ? JSON.stringify(data.questions) : assessment.questions,
        options: data.options ? JSON.stringify(data.options) : assessment.options,
        objectives: data.objectives ? JSON.stringify(data.objectives) : assessment.objectives,  // Now recognized
        correctAnswer: data.correctAnswer || assessment.correctAnswer,
      },
    });
  }
  // DELETE
  async remove(id: number) {
    await this.findOne(id); // Check if exists
    return this.prisma.manualAssessment.delete({ where: { id } });
  }
}
