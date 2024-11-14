// src/faq/faq.service.ts
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFAQDto } from './dto/create-faq.dto'; // Ensure DTO is imported
import { FAQ } from '@prisma/client';

@Injectable()
export class FAQService {
  constructor(private readonly prisma: PrismaService) {}

  // Method to create a new FAQ
  async createFAQ(createFaqDto: CreateFAQDto): Promise<FAQ> {
    const { question, answer } = createFaqDto;

    try {
      const faq = await this.prisma.fAQ.create({
        data: {
          question,
          answer,
        },
      });
      return faq;
    } catch (error) {
      console.error('Error creating FAQ:', error);
      throw new InternalServerErrorException('Could not create FAQ');
    }
  }

  // Method to get all FAQs
  async findAll() {
    try {
      console.log('Fetching all FAQs...');
      return await this.prisma.fAQ.findMany();
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      throw new NotFoundException('Failed to fetch FAQs');
    }
  }
  async searchUsersByName(name: string) {
    try {
      return await this.prisma.users.findMany({
        where: {
          OR: [
            {
              first_name: {
                contains: name,
                mode: 'insensitive',  
              },
            },
            {
              last_name: {
                contains: name,
                mode: 'insensitive',
              },
            },
          ],
        },
      });
    } catch (error) {
      console.error('Error while searching users:', error); // Log the error
      throw new Error('An error occurred while searching users.');
    }
  }
  async getProfile(userId: number) {
    try {
      // Fetch the user data from the database
      return await this.prisma.users.findUnique({
        where: {
          id: userId,
        },
        select: {
          first_name: true,
          last_name: true,
          role: true, // Assuming the role field exists in the database
        },
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Error fetching user profile');
    }
  }
}


