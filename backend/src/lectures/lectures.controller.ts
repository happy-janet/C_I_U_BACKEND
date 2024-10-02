import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { CreateLecturerSignUpDto } from './dto/create-lecturer.dto';
import { LecturesService } from './lectures.service'; 

@Controller('lectures')
export class LecturesController {
  constructor(private readonly lecturesService: LecturesService) {} 

  @Post()
  async create(@Body() createLecturerSignUpDto: CreateLecturerSignUpDto) {
    return await this.lecturesService.create(createLecturerSignUpDto); 
  }


//   @Get()
//   async getAllBooks(): Promise<Book[]> {
//       return this.lecturesService.findAll();
//   }
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
  return this.lecturesService.delete(+id); // Call the service method to delete a lecturer
}
}