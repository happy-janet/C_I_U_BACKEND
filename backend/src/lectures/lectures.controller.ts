import { Controller, Post, Body } from '@nestjs/common';
import { CreateLecturerSignUpDto } from './dto/create-lecturer.dto';
import { LecturesService } from './lectures.service'; // Import the service

@Controller('lectures')
export class LecturesController {
  constructor(private readonly lecturesService: LecturesService) {} // Inject the service

  @Post()
  async create(@Body() createLecturerSignUpDto: CreateLecturerSignUpDto) {
    return await this.lecturesService.create(createLecturerSignUpDto); // Call the service method
  }
}
