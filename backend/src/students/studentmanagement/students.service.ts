import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from '../dto/update-user.dto';
import { generateNumericToken } from './token-generator';
import { sendEmail } from './sendEmail';
@Injectable()
export class StudentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
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

    // Delete related LoginHistory records first
    await this.prisma.loginHistory.deleteMany({
      where: { studentId: id },
    });

    // Delete the user
    return this.prisma.users.delete({
      where: { id },
    });
  }

  async create(createUserDto: CreateUserDto) {
    try {
      // Find course name
      const course = await this.prisma.courses.findUnique({
        where: { id: createUserDto.courseId },
        select: { courseName: true },
      });

      if (!course) {
        throw new BadRequestException('Course not found');
      }

      const formattedEmail = `${createUserDto.first_name.toLowerCase()}@student.ciu.ac.ug`;

      // Generate a 6-digit token
      const token = generateNumericToken(6);

      // Save user with token
      const newUser = await this.prisma.users.create({
        data: {
          first_name: createUserDto.first_name,
          last_name: createUserDto.last_name,
          email: formattedEmail,
          program: course.courseName,
          registrationNo: createUserDto.registrationNo,
          password: '', // Leave blank initially
          role: createUserDto.role,
          courseId: createUserDto.courseId,
          resetToken: token,
          resetTokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Token valid for 7 days
        },
      });
  
      const resetLink = `https://ciu-online-exam-monitoring-system.netlify.app/studenttoken-password-reset?token=${token}`;
  
      // Prepare email content with a clickable button
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Welcome ${newUser.first_name},</h2>
          <p>Your registration is successful. Please use the button below to reset your password:</p>
          <p>Your setup token is: <strong>${token}</strong></p>
          <a href="${resetLink}" style="
            display: inline-block; 
            padding: 10px 20px; 
            background-color: #106053; 
            color: white; 
            text-decoration: none; 
            border-radius: 5px;
            margin: 20px 0;
          ">Confirm Email</a>
          <p>If the button doesn't work, copy and paste this link in your browser:</p>
          <p>${resetLink}</p>
          <p>This link will expire in 7 days.</p>
        </div>
      `;

      // Send email
      const subject = 'Set Your Password';
      const text = `Dear ${newUser.first_name},\n\nUse this token to set your password: ${token}\n\nThe token is valid for 7 days.`;
      await sendEmail(formattedEmail, subject, text, emailHtml);

      return {
        message: 'Student registered successfully. Token sent to email.',
      };
    } catch (error: any) {
      console.error('Error creating user:', error.message || error);
      throw error;
    }
  }

  async findByToken(token: string) {
    return this.prisma.users.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gte: new Date(),
        },
      },
    });
  }

  async updatePassword(userId: number, hashedPassword: string) {
    return this.prisma.users.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        resetToken: null, // Clear token after use
        resetTokenExpiry: null,
      },
    });
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
    } catch (error: any) {
      console.error('Error counting programs:', error.message);
      throw error;
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
      console.log('User found:', user);

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
          course: user.course
            ? {
                // Check if course data exists
                id: user.course.id,
                facultyName: user.course.facultyName,
                courseName: user.course.courseName,
                courseUnits: user.course.courseUnits,
              }
            : null, // course will be null if not available
        },
      };
    } catch (error) {
      console.error('Error logging in:', error);
      throw new InternalServerErrorException('Error logging in');
    }
  }

  // students.service.ts

  async submitManualAssessment(
    studentId: number,
    assessmentId: number,
    studentAnswers: any,
  ) {
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
        score++; // Increase score if the student's answer is correct
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
