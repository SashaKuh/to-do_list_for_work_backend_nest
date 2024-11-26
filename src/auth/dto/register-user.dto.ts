import { IsString, IsEmail, MinLength, MaxLength, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../schemas/auth.schema'; // Імпортуємо enum ролей

export class RegisterDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole; 
}