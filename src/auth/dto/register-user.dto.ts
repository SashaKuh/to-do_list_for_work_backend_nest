import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
