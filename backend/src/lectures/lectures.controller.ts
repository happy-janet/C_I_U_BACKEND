import { Controller, Post, Body, Patch, Param} from '@nestjs/common';
import { CreateLecturerSignUpDto } from './dto/create-lecturer.dto';
import { LecturesService } from './lectures.service'; // Import the service
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('lectures')
export class LecturesController {
  constructor(private readonly lecturesService: LecturesService) {} // Inject the service

  @Post()
  async create(@Body() createLecturerSignUpDto: CreateLecturerSignUpDto) {
    return await this.lecturesService.create(createLecturerSignUpDto); // Call the service method
  }

  // Update user by ID
  @Patch(':id')
  async updateUser(
        @Param('id') id: string, 
        @Body() updateUserDto: UpdateUserDto) {// Call the service method to update the user
    return this.lecturesService.updateUser(id, updateUserDto);
  }
}
