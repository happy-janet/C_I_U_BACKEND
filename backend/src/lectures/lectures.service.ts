import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'; 
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLecturerSignUpDto } from './dto/create-lecturer.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { sendEmail } from '../students/sendEmail';
import { generateNumericToken } from './token-generator';
import * as bcrypt from 'bcrypt';
import { SetInitialPasswordDto } from './dto/set-password.dto';

@Injectable()
export class LecturesService {
  constructor(private readonly prisma: PrismaService) {}

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

    // Prepare email content
    const emailText = `Welcome ${first_name}, your registration is successful. Your initial setup token is: ${setupToken}.`;
    const emailHtml = `<p>Welcome ${first_name}, your registration is successful. Your initial setup token is: <strong>${setupToken}</strong>.</p>`;

    await sendEmail(email, 'Registration Successful', emailText, emailHtml);

    return { message: 'Lecturer registered successfully. A confirmation token has been sent to your email.' };
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
}
