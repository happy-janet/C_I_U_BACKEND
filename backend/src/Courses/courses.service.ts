import { Injectable , NotFoundException,ConflictException} from '@nestjs/common';
// import { Injectable,  } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseDto } from './CoursesDto/Register-course.dto';
import { UpdateCourseDto } from './CoursesDto/update-course.dto';

@Injectable()
export class CoursesService {
    constructor(private readonly prisma: PrismaService) {}


    async create(createCourseDto: CreateCourseDto) {
      // Check if a course with the same name already exists
      const existingCourse = await this.prisma.courses.findFirst({
          where: {
              courseName: createCourseDto.courseName,
              facultyName: createCourseDto.facultyName
          }
      });

      // If course exists, throw a conflict exception
      if (existingCourse) {
          throw new ConflictException('Course with this name already exists in the specified faculty');
      }

      // If no existing course, proceed with creation
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