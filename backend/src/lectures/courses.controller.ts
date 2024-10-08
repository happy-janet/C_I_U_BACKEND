import { Controller, Post, Body, Patch, Param, Get, Delete } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { CoursesService } from './courses.service';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('coursesAdd')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  async create(@Body() createCourseDto: CreateCourseDto) {
    return await this.coursesService.create(createCourseDto);
  }
}