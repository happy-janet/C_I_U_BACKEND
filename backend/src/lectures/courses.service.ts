import { Injectable , NotFoundException } from '@nestjs/common';
// import { Injectable,  } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
    constructor(private readonly prisma: PrismaService) {}


    

    async create(createCourseDto: CreateCourseDto) {
        return this.prisma.courses.create({
            data: createCourseDto,
        });
    }


    async updateCourse(id: string, updateCourseDto: UpdateCourseDto) {
        // Check if the user exists
        const user = await this.prisma.courses.findUnique({ where: { id: Number(id) } });
        if (!user) {
          throw new NotFoundException('Course not found');
        }
        // Update the user
        return this.prisma.courses.update({
          where: { id: Number(id) },
          data: updateCourseDto,
        });
      }
      
      async findAll() {
  const courses = await this.prisma.courses.findMany();
  return courses.map(course => ({
    ...course,
    listFieldName: Array.isArray(course.courseUnitCode) ? course.courseUnitCode : [course.courseUnitCode],
  }));
}

    
      // Fetch a single course by ID
      async findOne(id: number) {
        return this.prisma.courses.findUnique({
          where: { id },
        });
      }
    
      // Delete a course by ID
      async delete(id: number) {
        return this.prisma.courses.delete({
          where: { id },
        });
      }
    
      
      async getCourseCount() {
        return this.prisma.courses.count();
      }


      async getCourseUnitCount() {
        const uniqueCourseUnits = await this.prisma.courses.findMany({
          select: {
            courseUnits: true,
          },
        });
      
        // Flatten the array of course units and get unique values
        const allCourseUnits = uniqueCourseUnits.flatMap(course => course.courseUnits);
        const uniqueUnits = new Set(allCourseUnits);
      
        return uniqueUnits.size;
      }
      
    }
    
