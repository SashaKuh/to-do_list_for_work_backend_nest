import { IsString, IsEnum, IsOptional, MinLength, MaxLength } from 'class-validator';
import { TodoDifficulty } from '../schemas/todo.schema';

export class CreateTodoDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  description?: string;

  @IsEnum(TodoDifficulty)
  difficulty: TodoDifficulty;
}