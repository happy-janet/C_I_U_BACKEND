import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Request,
  UseGuards,
  Query,
  Req,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from '../students/auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { FAQService } from '../students/faq.service';
import { FAQ } from '@prisma/client';
import { IssueReportService } from '../students/issue-report.service';
import { IssueReport } from '@prisma/client';
import { RolesGuard } from './roles.guard';
import { Roles } from './role.decorator';
import { CreateFAQDto } from  './dto/create-faq.dto'
import { ReportIssueDto } from './dto/report-issue.dto';
import {SubmissionDto} from './dto/SubmitAssessmentDto.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('students')
export class StudentsController {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly authService: AuthService,
    private readonly faqService: FAQService,
    private readonly issueReportService: IssueReportService
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
updateStudent(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  return this.studentsService.update(Number(id), updateUserDto);
}

  

  @Delete(':id')
  deleteStudent(@Param('id') id: string) {
    return this.studentsService.delete(Number(id));
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('count/students')
    async getStudentCount() {
        return this.studentsService.countStudents();
    }

    // @Get('count/programs')
    // async getProgramCount() {
    //     return this.studentsService.countPrograms();
    // }


  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    // Optionally handle any additional logout logic if necessary
    return { message: 'Logout successful. Remove the token from your client storage.' };
  }

  
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }
  @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
        return this.authService.resetPassword(resetPasswordDto);
    }
    
    @Post('faq')
  async createFAQ(
    @Body() createFaqDto: CreateFAQDto, // Use DTO here
  ): Promise<FAQ> {
    return this.faqService.createFAQ(createFaqDto);
  }

  @Get('Faqs')
  async getAllFaqs() {
    console.log('Received request to get all FAQs');
    return this.faqService.findAll();
  }


  @Post('report')
  async reportIssue(
    @Body() reportIssueDto: ReportIssueDto,
  ): Promise<IssueReport> {
    return this.issueReportService.reportIssue(reportIssueDto);
  }

// students.controller.ts

@Post('submit-assessment')
async submitAssessment(
  @Body() submitAssessmentDto: SubmissionDto,
  @Req() req: any
) {
  const studentId = req.user.id;  // Assuming user authentication is implemented
  return this.studentsService.submitManualAssessment(studentId, submitAssessmentDto.assessmentId, submitAssessmentDto.answers);
}

  
}
  









  