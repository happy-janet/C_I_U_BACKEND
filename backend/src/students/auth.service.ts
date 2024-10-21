import { Injectable, UnauthorizedException, InternalServerErrorException, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as crypto from 'crypto';
import { sendEmail } from './sendEmail';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { generateNumericToken } from './token-generator';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateStudent(loginDto: LoginDto): Promise<any> {
    const { registrationNo, password } = loginDto;

    const student = await this.prisma.users.findUnique({
      where: { registrationNo },
    });

    if (student && await bcrypt.compare(password, student.password)) {
      const { password, ...result } = student;
      return result; // Return student details without password
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async login(loginUserDto: LoginDto) {
    const { registrationNo, password } = loginUserDto;

    const user = await this.prisma.users.findUnique({
      where: { registrationNo },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, registrationNo: user.registrationNo };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      access_token: accessToken,
      user: { id: user.id, registrationNo: user.registrationNo },
    };
  }

  async logout(): Promise<any> {
    return { message: 'Logout successful. Please remove token on client.' };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.users.findUnique({
        where: { registrationNo: forgotPasswordDto.registrationNo },
    });

    if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Create a 6-digit numeric token
    const resetToken = generateNumericToken(6);

    // Store the reset token and expiry time in the database
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 1); // Set expiration to 1 hour

    await this.prisma.users.update({
        where: { id: user.id },
        data: {
            resetToken: resetToken,
            resetTokenExpiry: tokenExpiry,
        },
    });

    // Prepare email content
    const emailText = `You requested a password reset. Your reset token is: ${resetToken}. Enter this token on the reset password page.`;
    const emailHtml = `<p>You requested a password reset. Your reset token is: <strong>${resetToken}</strong>. Enter this token on the reset password page.</p>`;

    // Send the reset token via email
    await sendEmail(
        user.email,
        'Password Reset Request',
        emailText,
        emailHtml
    );

    return { message: 'Password reset token has been sent to your email.' };
}


async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
  const { token, newPassword, confirmPassword } = resetPasswordDto;

  if (newPassword !== confirmPassword) {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
  }

  // Find the user with the provided token
  const user = await this.prisma.users.findFirst({
      where: {
          resetToken: token,
          resetTokenExpiry: {
              gte: new Date(), // Ensure the token is still valid (not expired)
          },
      },
  });

  if (!user) {
      throw new HttpException('Invalid or expired token', HttpStatus.BAD_REQUEST);
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update user's password and clear the reset token fields
  await this.prisma.users.update({
      where: { id: user.id },
      data: {
          password: hashedPassword,
          resetToken: null, // Clear the token after successful reset
          resetTokenExpiry: null,
      },
  });

  return { message: 'Your password has been successfully reset.' };
}
}