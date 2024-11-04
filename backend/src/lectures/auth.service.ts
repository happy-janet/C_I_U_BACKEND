import { Injectable, UnauthorizedException, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateLecturerSignUpDto } from './dto/create-lecturer.dto';
import { LecturesService } from './lectures.service'; 
import { sendEmail } from '../students/sendEmail';
import { generateNumericToken } from './token-generator';
import * as bcrypt from 'bcrypt';

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

  async login(email: string, password: string) {
    // Find the user by email
    const user = await this.prisma.lecturerSignUp.findUnique({
        where: { email },
    });

    // Check if user exists
    if (!user) {
        throw new UnauthorizedException('Invalid email or password');
    }

    // Check if the password matches
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
    }

    // Create a payload for JWT
    const payload = { email: user.email, sub: user.id };

    // Generate the JWT token
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


  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.lecturerSignUp.findUnique({
      where: { email: forgotPasswordDto.email },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const resetToken = generateNumericToken(6);
    const tokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1-hour expiry

    await this.prisma.lecturerSignUp.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry: tokenExpiry,
      },
    });

    const emailText = `You requested a password reset. Your reset token is: ${resetToken}. Enter this token on the reset page.`;
    const emailHtml = `<p>You requested a password reset. Your reset token is: <strong>${resetToken}</strong>. Enter this token on the reset page.</p>`;

    await sendEmail(user.email, 'Password Reset Request', emailText, emailHtml);

    return { message: 'A reset token has been sent to your email.' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { token, newPassword } = resetPasswordDto;

    const user = await this.prisma.lecturerSignUp.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gte: new Date() },
      },
    });

    if (!user) {
      throw new HttpException('Invalid or expired token', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.lecturerSignUp.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { message: 'Your password has been reset successfully.' };
  }



}
