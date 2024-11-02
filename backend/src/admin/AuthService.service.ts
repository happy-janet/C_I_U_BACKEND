import { Injectable, UnauthorizedException, InternalServerErrorException, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { sendEmail } from '../students/sendEmail';
import { generateNumericToken } from './token-generator';



@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // Validate user credentials
  async validateUser(email: string, password: string) {
    const user = await this.prisma.adminSignUp.findUnique({ where: { email } });
    
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { password: _, ...result } = user; // Remove password from user data
    return result;
  }

  // Issue JWT token
  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload), 
    };
  }


  
  
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.adminSignUp.findUnique({
        where: {email: forgotPasswordDto.email },
    });

    if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Create a 6-digit numeric token
    const resetToken = generateNumericToken(6);

    // Store the reset token and expiry time in the database
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 1); // Set expiration to 1 hour

    await this.prisma.adminSignUp.update({
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
  const user = await this.prisma.adminSignUp.findFirst({
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
  await this.prisma.adminSignUp.update({
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
