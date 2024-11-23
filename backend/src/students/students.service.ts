import { Injectable, NotFoundException, UnauthorizedException, InternalServerErrorException,BadRequestException, } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt'; 
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class StudentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService 
  ) {}

  // Get all students
  async findAll() {
    return this.prisma.users.findMany();
  }

  // Get a student by ID
  async findOneById(id: number) {
    const student = await this.prisma.users.findUnique({
      where: { id },
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return student;
  }

  // Create a new student
  
  
  // Update student details
  async update(id: number, updateUserDto: UpdateUserDto) {
  const existingStudent = await this.findOneById(id);
  if (!existingStudent) {
    throw new NotFoundException(`Student with ID ${id} not found`);
  }

  // Update the email if the first name changes
  let formattedEmail = existingStudent.email; // Default to existing email
  if (updateUserDto.first_name) {
    formattedEmail = `${updateUserDto.first_name.toLowerCase()}@student.ciu.ac.ug`;
  }

  return this.prisma.users.update({
    where: { id },
    data: {
      first_name: updateUserDto.first_name,
      last_name: updateUserDto.last_name,
      email: formattedEmail, // Use the formatted email
      program: updateUserDto.program,
      registrationNo: updateUserDto.registrationNo,
      password: updateUserDto.password,
      role: updateUserDto.role,
      courseId: updateUserDto.courseId,
    },
  });
}


  

  // Reset student password
  async resetPassword(id: number, newPassword: string) {
    const student = await this.findOneById(id);
    if (!student) {
        throw new NotFoundException(`Student with ID ${id} not found`);
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return this.prisma.users.update({
        where: { id },
        data: { password: hashedPassword }, // Store the hashed password
    });
}


  // Delete a student
  async delete(id: number) {
    await this.findOneById(id); 
    return this.prisma.users.delete({
      where: { id },
    });
  }

 

  
  async create(createUserDto: CreateUserDto) {
    try {
      // Find the course name using the courseId
      const course = await this.prisma.courses.findUnique({
        where: { id: createUserDto.courseId },
        select: { courseName: true },
      });
  
      if (!course) {
        throw new BadRequestException('Course not found');
      }
  
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
  
      // Format the email address
      const formattedEmail = `${createUserDto.first_name.toLowerCase()}@student.ciu.ac.ug`;
  
      return await this.prisma.users.create({
        data: {
          first_name: createUserDto.first_name,
          last_name: createUserDto.last_name,
          email: formattedEmail, // Use the formatted email
          program: course.courseName,
          registrationNo: createUserDto.registrationNo,
          password: hashedPassword,
          role: createUserDto.role,
          courseId: createUserDto.courseId,
        },
      });
    } catch (error) {
      console.error('Error creating user:', error);
      throw new InternalServerErrorException('Error creating user');
    }
  }
  
  

  // Login method
   async countStudents() {
    return this.prisma.users.count();
  }

  async countPrograms() {
    try {
      const uniquePrograms = await this.prisma.users.findMany({
        select: { program: true },
        distinct: ['program'],
      });

      return { count: uniquePrograms.length };
    } catch (error) {
      console.error('Error counting programs:', error.message);
      throw new Error('Failed to count programs');
    }
  }


  async login(loginUserDto: LoginDto) { 
    try {
      const { registrationNo, password } = loginUserDto;
  
      // Retrieve the user with the course data included
      const user = await this.prisma.users.findUnique({
        where: { registrationNo },
        include: { course: true }, // Ensure to include course relationship
      });
  
      // Log user data to confirm the courseId and course are fetched
      console.log("User found:", user);
  
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      // Verify the password
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      const payload = { sub: user.id, registrationNo: user.registrationNo };
      const accessToken = this.jwtService.sign(payload);
  
      // Return the login response, including courseId and course details
      return {
        message: 'Login successful',
        access_token: accessToken,
        user: {
          id: user.id,
          registrationNo: user.registrationNo,
          courseId: user.courseId ?? null, // courseId will be null if not set
          course: user.course ? { // Check if course data exists
            id: user.course.id,
            facultyName: user.course.facultyName,
            courseName: user.course.courseName,
            courseUnits: user.course.courseUnits,
          } : null, // course will be null if not available
        },
      };
    } catch (error) {
      console.error('Error logging in:', error);
      throw new InternalServerErrorException('Error logging in');
    }
  }
  
  


  
  // students.service.ts

async submitManualAssessment(studentId: number, assessmentId: number, studentAnswers: any) {
  
  const assessment = await this.prisma.manualAssessment.findUnique({
    where: { id: assessmentId },
    include: { questions: true },
  });

  if (!assessment) {
    throw new Error('Assessment not found');
  }

  // Initialize score
  let score = 0;
  const totalQuestions = assessment.questions.length;

  // Iterate through each question and compare student's answers
  assessment.questions.forEach((question) => {
    const studentAnswer = studentAnswers[question.id];
    if (studentAnswer === question.answer) {
      score++;  // Increase score if the student's answer is correct
    }
  });

  // Calculate the percentage
  const percentage = (score / totalQuestions) * 100;

  // Save the submission
  const submission = await this.prisma.submission.create({
    data: {
      studentId: studentId,
      assessmentId: assessmentId,
      answers: studentAnswers,
      score: score,
      percentage: percentage,
      submittedAt: new Date(),
    },
  });

  return { score, totalQuestions, percentage };
}

}