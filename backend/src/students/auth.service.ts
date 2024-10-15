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

    // Create reset token
    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Prepare email content
    const emailText = `You requested a password reset. Please use the following token to reset your password: ${resetToken}. Copy this token and enter it on the reset password page.`;
    const emailHtml = `<p>You requested a password reset. Please use the following token to reset your password: <strong>${resetToken}</strong>. Copy this token and enter it on the reset password page.</p>`;

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
  let userId;
  try {
      const decoded = jwt.verify(resetPasswordDto.token, process.env.JWT_SECRET) as any;
      userId = decoded.id;
  } catch (error) {
      throw new HttpException('Invalid or expired token', HttpStatus.BAD_REQUEST);
  }

  const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);

  await this.prisma.users.update({
      where: { id: userId },
      data: {
          password: hashedPassword,
      },
  });

  return { message: 'Your password has been successfully reset.' };
}

}
