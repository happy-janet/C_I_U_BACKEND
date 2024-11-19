import { IsNotEmpty, IsInt, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsInt()
  senderId: number;

  @IsNotEmpty()
  @IsInt()
  receiverId: number; // Add receiverId

  @IsNotEmpty()
  @IsInt()
  chatId: number;

  @IsNotEmpty()
  @IsString()
  text: string;
}


