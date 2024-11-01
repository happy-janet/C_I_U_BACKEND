import { Injectable, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateLecturerSignUpDto } from './dto/create-lecturer.dto';
import { sendEmail } from '../students/sendEmail'; // Ensure this path is correct
import { generateNumericToken } from './token-generator';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, token: string) {
    const user = await this.prisma.lecturerSignUp.findUnique({ where: { email } });

    if (!user || user.token !== token || user.tokenExpiry < new Date()) {
      throw new UnauthorizedException('Invalid email or token');
    }

    const { token: _, tokenExpiry: __, ...result } = user; // Remove token and expiry from result
    return result;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.lecturerSignUp.findUnique({
      where: { email: forgotPasswordDto.email },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Create a 6-digit numeric token for reset
    const resetToken = generateNumericToken(6);

    // Store the reset token and expiry time in the database
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 1); // Set expiration to 1 hour

    await this.prisma.lecturerSignUp.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry: tokenExpiry,
      },
    });

    // Prepare email content
    const emailText = `You requested a reset. Your reset token is: ${resetToken}. Enter this token on the reset page.`;
    const emailHtml = `<p>You requested a reset. Your reset token is: <strong>${resetToken}</strong>. Enter this token on the reset page.</p>`;

    // Send the reset token via email
    await sendEmail(user.email, 'Reset Request', emailText, emailHtml);

    return { message: 'Reset token has been sent to your email.' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { token } = resetPasswordDto;

    const user = await this.prisma.lecturerSignUp.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gte: new Date(),
        },
      },
    });

    if (!user) {
      throw new HttpException('Invalid or expired token', HttpStatus.BAD_REQUEST);
    }

    // Clear the reset token fields after successful reset
    await this.prisma.lecturerSignUp.update({
      where: { id: user.id },
      data: {
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { message: 'Your reset has been successfully processed.' };
  }

  // New method to register a lecturer and send an initial token
  async registerLecturer(registerLecturerDto: CreateLecturerSignUpDto): Promise<{ message: string }> {
    const { first_name, last_name, email, role } = registerLecturerDto;

    // Generate an initial token for registration
    const token = generateNumericToken(6); // Assuming a numeric token
    const tokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Set expiry to 7 days

    // Create the lecturer record in the database
    await this.prisma.lecturerSignUp.create({
      data: {
        first_name,
        last_name,
        email,
        role,
        token, // Store the initial token
        tokenExpiry, // Store the expiry time
      },
    });

    // Prepare email content
    const emailText = `Welcome ${first_name}, your registration is successful. Your initial token is: ${token}.`;
    const emailHtml = `<p>Welcome ${first_name}, your registration is successful. Your initial token is: <strong>${token}</strong>.</p>`;

    // Send the initial token via email
    await sendEmail(email, 'Registration Successful', emailText, emailHtml);

    return { message: 'Lecturer registered successfully. A confirmation token has been sent to your email.' };
  }
}
