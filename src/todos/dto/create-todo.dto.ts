import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TodoDifficulty, TodoStatus } from '../schemas/todo.schema';

// DTO: Передача даних з контролера до сервісу
export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TodoDifficulty)
  difficulty: TodoDifficulty;

  @IsEnum(TodoStatus)
  status: TodoStatus;
}
