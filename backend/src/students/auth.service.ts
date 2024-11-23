import { Injectable, UnauthorizedException, Logger, HttpException, HttpStatus,InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { generateNumericToken } from './token-generator';
import { sendEmail } from './sendEmail';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateStudent(loginDto: LoginDto): Promise<any> {
    const { registrationNo, password } = loginDto;

    const student = await this.prisma.users.findUnique({
      where: { registrationNo },
    });

    if (student && (await bcrypt.compare(password, student.password))) {
      const { password, ...result } = student;
      return result;
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

    await this.prisma.loginHistory.create({
      data: {
        studentId: user.id,
        loginTime: new Date(),
        ipAddress: '', // Set dynamically during controller execution
      },
    });

    return {
      message: 'Login successful',
      access_token: accessToken,
      user: { id: user.id, registrationNo: user.registrationNo },
    };
  }

  async getLoginHistory(studentId: number): Promise<any> {
    return this.prisma.loginHistory.findMany({
      where: { studentId },
      orderBy: { loginTime: 'desc' },
    });
  }

  async updateName(userId: number, updateNameDto: { firstName?: string; lastName?: string }): Promise<any> {
    try {
      const updatedUser = await this.prisma.users.update({
        where: { id: userId },
        data: {
          first_name: updateNameDto.firstName,
          last_name: updateNameDto.lastName,
        },
      });

      return { message: 'Profile updated successfully', user: updatedUser };
    } catch (error) {
      this.logger.error('Error updating user profile:', error);
      throw new InternalServerErrorException('Error updating user profile');
    }
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

    const resetToken = generateNumericToken(6);
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 1);

    await this.prisma.users.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry: tokenExpiry,
      },
    });

    const emailText = `Your reset token is: ${resetToken}`;
    const emailHtml = `<p>Your reset token is: <strong>${resetToken}</strong></p>`;

    await sendEmail(user.email, 'Password Reset Request', emailText, emailHtml);

    return { message: 'Password reset token has been sent to your email.' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { token, newPassword, confirmPassword } = resetPasswordDto;

    if (newPassword !== confirmPassword) {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }

    const user = await this.prisma.users.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gte: new Date() },
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

    return { message: 'Password successfully reset.' };
  }
}
