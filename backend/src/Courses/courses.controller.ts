import { Controller, Post, Body, Patch, Param, Get, Delete } from '@nestjs/common';
import { CreateCourseDto } from './CoursesDto/Register-course.dto';
import { CoursesService } from './courses.service';
import { UpdateCourseDto } from './CoursesDto/update-course.dto';

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

  @Get('units/count')
  async getCourseUnitCount() {
    const count = await this.coursesService.getCourseUnitCount(); // Await the promise
    return { count }; // Return the count directly
  }

  
  @Get('count')
  async getCourseCount() {
    return this.coursesService.getCourseCount(); // Await the promise
    
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