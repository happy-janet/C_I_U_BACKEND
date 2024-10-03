import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  getAllStudents() {
    return this.studentsService.findAll();
  }

  @Get(':id')
getStudentById(@Param('id') id: string) {
  return this.studentsService.findOneById(Number(id)); 
}

@Post()
createStudent(@Body() createUserDto: CreateUserDto) {
  return this.studentsService.create(createUserDto);
}

@Patch(':id')
updateStudent(@Param('id') id: string, @Body() updateUserDto: CreateUserDto) {
  return this.studentsService.update(Number(id), updateUserDto); 
}

@Patch('reset-password/:id')
resetPassword(@Param('id') id: string, @Body() resetPasswordDto: ResetPasswordDto) {
  return this.studentsService.resetPassword(Number(id), resetPasswordDto.newPassword); 
}

@Delete(':id')
deleteStudent(@Param('id') id: string) {
  return this.studentsService.delete(Number(id));
}

}
