import { Controller, Post, Body, Patch, Param, Get, Delete, BadRequestException  } from '@nestjs/common';
import { CreateLecturerSignUpDto } from './lecturerManagementDto/Register-lecturer.dto';
import { LecturesService } from './lecturer.service'; 
import { UpdateUserDto } from './lecturerManagementDto/update-lecturer.dto';
import { CreateCourseDto } from '../../Courses/CoursesDto/Register-course.dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { SetInitialPasswordDto } from '../LecturerAuth/LecturerAuthDto/set-password.dto';

@Controller('lecturerReg')
export class LecturesController {
  constructor(private readonly lecturesService: LecturesService,
    private readonly prisma: PrismaService,
  ) {} 

  @Post()
  async create(@Body() createLecturerSignUpDto: CreateLecturerSignUpDto) {
    return await this.lecturesService.create(createLecturerSignUpDto); 
  }
  @Post('set-password')
  async setPassword(@Body() setInitialPasswordDto: SetInitialPasswordDto) {
      return this.lecturesService.setPassword(setInitialPasswordDto);
  }
  
  // Update user by ID
  @Patch(':id')
  async updateUser(
        @Param('id') id: string, 
        @Body() updateUserDto: UpdateUserDto) {
    return this.lecturesService.updateUser(id, updateUserDto);
  }


@Get()
async findAll() {
  return this.lecturesService.findAll(); 
}

@Get('count')
async getLecturerCount() {
  return this.lecturesService.getLecturerCount();
  
}

// Get a single lecturer by ID
@Get(':id')
async findOne(@Param('id') id: string) {
  return this.lecturesService.findOne(+id); 
}


// Delete a lecturer by ID
@Delete(':id')
async delete(@Param('id') id: string) {
  return this.lecturesService.delete(+id); 
}

@Get('profile/:id')
async getLecturerProfile(@Param('id') id: string) {
  return this.prisma.lecturerSignUp.findUnique({
    where: { id: parseInt(id) },
    select: { first_name: true, last_name: true, role: true},  // Only select the necessary fields
  });
}
}



