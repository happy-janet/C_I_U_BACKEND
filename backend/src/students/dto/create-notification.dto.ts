// src/students/notification/dto/create-notification.dto.ts
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsInt()
  userId: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  eventType: string;
}
