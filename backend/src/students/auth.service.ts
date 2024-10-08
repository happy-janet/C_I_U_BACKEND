import { Injectable, UnauthorizedException, InternalServerErrorException, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as crypto from 'crypto';
import { sendEmail } from './sendEmail';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // Validate student by registration number and password
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

  // Login method to issue JWT token
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

  // Logout method
  async logout(): Promise<any> {
    return { message: 'Logout successful. Please remove token on client.' };
  }

  // Forgot Password
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.users.findUnique({
      where: { registrationNo: forgotPasswordDto.registrationNo },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000); // 1 hour

    await this.prisma.users.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpiry: expiry,
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await sendEmail(
      user.email,
      'Password Reset Request',
      `You requested a password reset. Use the following token to reset your password: ${token}`,
      `<p>You requested a password reset.</p><p>Use the following token to reset your password:</p><h3>${token}</h3><p>Or click the link below:</p><a href="${resetUrl}">Reset Password</a>`
    );

    return { message: 'Password reset token has been sent to your registered email.' };
  }

  // Reset Password
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { token, newPassword, confirmPassword } = resetPasswordDto;

    if (newPassword !== confirmPassword) {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }

    const user = await this.prisma.users.findFirst({
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

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.users.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { message: 'Password has been reset successfully. Please log in with your new password.' };
  }
}
