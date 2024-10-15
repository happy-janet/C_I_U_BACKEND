import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatemanualAssessmentDto } from './dto/create-addAssessment.dto';
import { UpdatemanualAssessmentDto } from './dto/update-addAssessment.dto';

@Injectable()
export class ManualAssessmentService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  async create(data: CreatemanualAssessmentDto) {
    return this.prisma.ManualAssessment.create({
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
        questions: data.questions, // Assuming it's an array of QuestionManual objects
      },
    });
  }

  // FIND ALL
  async findAll() {
    return this.prisma.ManualAssessment.findMany({
      include: { questions: true }, // Include related questions if needed
    });
  }

  // FIND ONE BY ID
  async findOne(id: number) {
    const assessment = await this.prisma.ManualAssessment.findUnique({
      where: { id },
      include: { questions: true }, // Include related questions if needed
    });

    if (!assessment) {
      throw new NotFoundException(`Assessment with ID ${id} not found`);
    }

    return assessment;
  }

  // UPDATE
  async update(id: number, data: UpdatemanualAssessmentDto) {
    const assessment = await this.findOne(id);
  
    return this.prisma.ManualAssessment.update({
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
        questions: data.questions || assessment.questions, // Assuming it's an array of QuestionManual objects
      },
    });
  }

  // DELETE
  async remove(id: number) {
    await this.findOne(id); // Check if exists
    return this.prisma.ManualAssessment.delete({ where: { id } });
  }
}
