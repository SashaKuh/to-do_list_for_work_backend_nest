import { IsEnum, IsOptional, IsString, IsDate } from 'class-validator';
import { TodoDifficulty, TodoStatus } from '../schemas/todo.schema';

export class UpdateTodoDto {
    @IsString() @IsOptional() title?: string;
    @IsString() @IsOptional() description?: string;
    @IsEnum(TodoDifficulty) @IsOptional() difficulty?: TodoDifficulty;
    @IsEnum(TodoStatus) @IsOptional() status?: TodoStatus;
    @IsString() @IsOptional() comment?: string;
    @IsDate() @IsOptional() deadline?: Date;
}