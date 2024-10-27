import { Controller, Post, Body, Patch, Param, Get, Delete } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { CoursesService } from './courses.service';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('coursesAdd')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // Create a new course
  @Post()
  async create(@Body() createCourseDto: CreateCourseDto) {
    return await this.coursesService.create(createCourseDto);
  }

  // Update an existing course by ID
  @Patch(':id')
  async updateCourse(
    @Param('id') id: string, 
    @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.updateCourse(id, updateCourseDto); // Ensure id is numeric
  }

  // Retrieve all courses
  @Get()
  async findAll() {
    return this.coursesService.findAll();
  }

  // Get a single course by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.coursesService.findOne(+id);  // Ensure id is numeric
  }

  // Delete a course by ID
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.coursesService.delete(+id);  // Ensure id is numeric
  }
}