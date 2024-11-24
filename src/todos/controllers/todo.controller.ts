import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  HttpCode, 
  HttpStatus 
} from '@nestjs/common';
import { TodoService } from '../services/todo.service';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { Todo } from '../schemas/todo.schema';

@Controller('todolists')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async getAllTasks(): Promise<Todo[]> {
    return this.todoService.getAllTasks();
  }

  @Get(':taskId')
  async getTaskById(@Param('taskId') taskId: string): Promise<Todo> {
    return this.todoService.getTaskById(taskId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTask(@Body() todoData: CreateTodoDto): Promise<Todo> {
    return this.todoService.createTask(todoData);
  }

  @Put(':taskId')
  async updateTask(
    @Param('taskId') taskId: string, 
    @Body() todoData: Partial<Todo>
  ): Promise<Todo> {
    return this.todoService.updateTask(taskId, todoData);
  }

  @Delete(':taskId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTask(@Param('taskId') taskId: string): Promise<void> {
    await this.todoService.deleteTask(taskId);
  }
}