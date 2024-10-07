import { Controller, Post, Body, Patch, Param, Get, Delete } from '@nestjs/common';
import { CreateLecturerSignUpDto } from './dto/create-lecturer.dto';
import { LecturesService } from './lectures.service'; 
import { UpdateUserDto } from './dto/update-user.dto';


@Controller('lectures')
export class LecturesController {
  constructor(private readonly lecturesService: LecturesService) {} 

  @Post()
  async create(@Body() createLecturerSignUpDto: CreateLecturerSignUpDto) {
    return await this.lecturesService.create(createLecturerSignUpDto); 
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
}