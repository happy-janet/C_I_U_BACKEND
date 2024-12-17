import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateAdminSignUpDto } from './adminRegistrationManagementDto/create-admin.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../../lecturer/lecturerManagement/lecturerManagementDto/update-lecturer.dto';
import { sendEmail } from '../../students/studentmanagement/sendEmail';
import { generateNumericToken } from './token';
import { SetPasswordDto } from './adminRegistrationManagementDto/set-password.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // Create admin with hashed password
  async registerAdmin(
    createAdminSignUpDto: CreateAdminSignUpDto,
  ): Promise<{ message: string }> {
    // Email validation pattern for the admin email format
    const emailPattern = /^[a-zA-Z]+@ciu\.ac\.ug$/;

    if (!emailPattern.test(createAdminSignUpDto.email)) {
      throw new BadRequestException(
        'Email must be in the format: firstname@ciu.ac.ug',
      );
    }

    const { first_name, last_name, email, role } = createAdminSignUpDto;

    // Check if the email already exists
    const existingAdmin = await this.prisma.adminSignUp.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      throw new BadRequestException('An admin with this email already exists.');
    }

    // Generate a 6-digit numeric token for initial setup
    const setupToken = generateNumericToken(6);
    const tokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Token valid for 7 days

    // Create admin record without password
    await this.prisma.adminSignUp.create({
      data: {
        first_name,
        last_name,
        email,
        role,
        resetToken: setupToken, // Store the generated setup token as resetToken
        resetTokenExpiry: tokenExpiry, // Store token expiry date
      },
    });

    const resetLink = `https://ciu-online-exam-monitoring-system.netlify.app/admintoken-password-reset?token=${setupToken}`;

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

    // Prepare email content for plain-text fallback
    const emailText = `Welcome ${first_name}, your registration is successful. Your initial setup token is: ${setupToken}.
Please use the following link to reset your password: ${resetLink}. This link will expire in 7 days.`;

    // Send the email with the token to the admin's email
    await sendEmail(email, 'Registration Successful', emailText, emailHtml);

    return {
      message:
        'Admin registered successfully. A confirmation token has been sent to your email.',
    };
  }

  async setPassword(
    token: string,
    password: string,
    confirmPassword: string,
  ): Promise<string> {
    // Validate inputs
    if (!token || !password || !confirmPassword) {
      throw new BadRequestException(
        'All fields (token, password, confirmPassword) are required.',
      );
    }

    if (password !== confirmPassword) {
      throw new BadRequestException(
        'Password and Confirm Password do not match.',
      );
    }

    // Find admin by reset token
    const admin = await this.prisma.adminSignUp.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gte: new Date() }, // Ensure the token is not expired
      },
    });

    if (!admin) {
      throw new BadRequestException('Invalid or expired token.');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update admin record
    await this.prisma.adminSignUp.update({
      where: { id: admin.id },
      data: {
        password: hashedPassword,
        resetToken: null, // Clear the token
        resetTokenExpiry: null, // Clear the expiry
      },
    });

    return 'Password has been set successfully.';
  }

  // Update admin by ID
  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.adminSignUp.findUnique({
      where: { id: Number(id) },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.prisma.adminSignUp.update({
      where: { id: Number(id) },
      data: updateUserDto,
    });
  }

  // Fetch all admins
  async findAll() {
    return this.prisma.adminSignUp.findMany();
  }

  // Fetch a single admin by ID
  async findOne(id: number) {
    return this.prisma.adminSignUp.findUnique({
      where: { id },
    });
  }

  // Delete an admin by ID
  async delete(id: number) {
    return this.prisma.adminSignUp.delete({
      where: { id },
    });
  }

  async getProfile(id: number) {
    return this.prisma.adminSignUp.findUnique({
      where: { id },
      select: {
        first_name: true,
        last_name: true,
        role: true,
      },
    });
  }
}
