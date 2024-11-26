import { IsEnum, IsNotEmpty, IsOptional, IsString, IsDate } from 'class-validator';
import { TodoDifficulty, TodoStatus } from '../schemas/todo.schema';
import { ApiProperty } from '@nestjs/swagger';

// DTO: Передача даних з контролера до сервісу
export class CreateTodoDto {
  @ApiProperty({ 
    description: 'Title of the task', 
    example: 'Complete project report' 
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ 
    description: 'Optional task description', 
    example: 'Prepare quarterly report for management',
    required: false 
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ 
    description: 'Task difficulty level', 
    enum: TodoDifficulty,
    example: TodoDifficulty.MEDIUM 
  })
  @IsEnum(TodoDifficulty)
  difficulty: TodoDifficulty;

  @ApiProperty({ 
    description: 'Current status of the task', 
    enum: TodoStatus,
    example: TodoStatus.IN_PROGRESS 
  })
  @IsEnum(TodoStatus)
  status: TodoStatus;

  @ApiProperty({ 
    description: 'Optional comment on the task', 
    example: 'Needs review by senior manager',
    required: false 
  })
  @IsString()
  @IsOptional()
  comment?: string; 

  @ApiProperty({ 
    description: 'Optional deadline for the task', 
    type: Date,
    required: false 
  })
  @IsDate()
  @IsOptional()
  deadline?: Date; 
}