import { Injectable, NotFoundException, UnauthorizedException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common'; 
import { PrismaService } from '../../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CreateLecturerSignUpDto } from './lecturerManagementDto/Register-lecturer.dto';
import { UpdateUserDto } from './lecturerManagementDto/update-lecturer.dto';
import { sendEmail } from '../../students/studentmanagement/sendEmail';
import { generateNumericToken } from '../token-generator';
import * as bcrypt from 'bcrypt';
import { SetInitialPasswordDto } from '../LecturerAuth/LecturerAuthDto/set-password.dto';
import { LoginDto } from '../LecturerAuth/LecturerAuthDto/lecturerLogin.dto'; // Import your DTO

@Injectable()
export class LecturesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService 
  ) {}

  async create(createLecturerSignUpDto: CreateLecturerSignUpDto): Promise<{ message: string }> {
    const emailPattern = /^[a-zA-Z]+@ciu\.ac\.ug$/;

    if (!emailPattern.test(createLecturerSignUpDto.email)) {
        throw new BadRequestException('Email must be in the format: firstname@ciu.ac.ug');
    }

    const { first_name, last_name, email, role } = createLecturerSignUpDto;

    // Generate a 6-digit numeric initial setup token
    const setupToken = generateNumericToken(6);
    const tokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Token valid for 7 days

    await this.prisma.lecturerSignUp.create({
        data: {
            first_name,
            last_name,
            email,
            role,
            token: setupToken, // Store the generated setup token
            tokenExpiry, // Store token expiry date
        },
    });

    // Create a direct link to the token reset page
    const resetLink = `https://ciu-online-exam-monitoring-system.netlify.app/token-password-reset?token=${setupToken}`;

    // Prepare email content with a clickable button
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Welcome ${first_name},</h2>
        <p>Your registration is successful. Please use the button below to reset your password:</p>
        <p>Your setup token is: <strong>${setupToken}</strong></p>
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

    const emailText = `Welcome ${first_name}, your registration is successful. 
    Use this link to reset your password: ${resetLink}
    Your setup token is: ${setupToken}`;

    await sendEmail(email, 'Registration Successful - Reset Password', emailText, emailHtml);

    return { message: 'Lecturer registered successfully. A confirmation email has been sent.' };
  }










async setPassword(setupPasswordDto: SetInitialPasswordDto): Promise<{ message: string }> {
  const { setupToken, newPassword, confirmPassword } = setupPasswordDto;

  // Check if newPassword and confirmPassword match
  if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
  }

  const user = await this.prisma.lecturerSignUp.findFirst({
      where: {
          token: setupToken, // Assuming you want to match using the setup token
          tokenExpiry: {
              gte: new Date(),
          },
      },
  });

  if (!user) {
      throw new BadRequestException('Invalid or expired token');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await this.prisma.lecturerSignUp.update({
      where: { id: user.id },
      data: {
          password: hashedPassword,
          token: null, // Clear the token after setting the password
          tokenExpiry: null, // Clear token expiry
      },
  });

  return { message: 'Password created successfully' };
}

async login(email: string, password: string) {
  const user = await this.prisma.lecturerSignUp.findUnique({
      where: { email },
  });

  if (!user) {
      throw new UnauthorizedException('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
  }

  const payload = { email: user.email, sub: user.id };
  return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
    },
  };
}
  // Fetch all lecturers
  async findAll() {
    return this.prisma.lecturerSignUp.findMany();
  }

  // Update lecturer details
  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.lecturerSignUp.findUnique({ where: { id: Number(id) } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.prisma.lecturerSignUp.update({
      where: { id: Number(id) },
      data: updateUserDto,
    });
  }

  // Find a single lecturer by ID
  async findOne(id: number) {
    return this.prisma.lecturerSignUp.findUnique({
      where: { id },
    });
  }

  // Delete a lecturer by ID
  async delete(id: number) {
    return this.prisma.lecturerSignUp.delete({
      where: { id },
    });
  }

  async getLecturerCount() {
    return this.prisma.lecturerSignUp.count();
  }
}