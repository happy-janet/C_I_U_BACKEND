import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from '../students/auth.service';
@Controller('students')
export class StudentsController {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly authService: AuthService 
  ) {}
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

@Post('login')
async login(@Body() loginDto: LoginDto) {
    console.log('Received login DTO:', loginDto);
    return this.authService.login(loginDto);
}

@Get('count/students')
  async getStudentCount() {
    return this.studentsService.countStudents();
  }

  @Get('count/programs')
  async getProgramCount() {
    return this.studentsService.countPrograms();
  }
}




