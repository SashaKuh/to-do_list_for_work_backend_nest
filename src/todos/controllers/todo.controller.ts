import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { TodoService } from '../services/todo.service';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { Todo } from '../schemas/todo.schema';
import { AuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../interfaces/request-with-user.interface';
import { UpdateTodoDto } from '../dto/update-todo.dto';
import { AssignTodoDto } from '../dto/assign-todo.dto';


// Repository Pattern (Інкапсуляція доступу до бази даних у спеціальному класі)
@Controller('todolists')
@UseGuards(AuthGuard)  // DIP: Залежність від абстракції (AuthGuard) для авторизації
export class TodoController {
  constructor(private readonly todoService: TodoService) {} // DIP: Сервіс передається через інверсію залежностей

  @Get()
  async getAllTasks(@Req() req: RequestWithUser): Promise<Todo[]> {
    const ownerId = req.user.id;
    console.log('ownerId', ownerId);
    return this.todoService.getAllTasks(ownerId); // SRP: Контролер делегує логіку сервісу
  }

  @Get(':taskId')
  async getTaskById(@Param('taskId') taskId: string, @Req() req: RequestWithUser): Promise<Todo> {
    const ownerId = req.user.id;
    console.log(taskId, ownerId);
    return this.todoService.getTaskById(taskId, ownerId);  // SRP: Виклик бізнес-логіки з сервісу
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTask(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) todoData: CreateTodoDto, // OCP: Додавання валідації без зміни базового коду
    @Req() req: RequestWithUser
  ): Promise<Todo> {
    const owner = { id: req.user.id, name: req.user.name, email: req.user.email };
    return this.todoService.createTask(owner, todoData);
  }

  @Put(':taskId')
  async updateTask(
    @Param('taskId') taskId: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) todoData: UpdateTodoDto,
    @Req() req: RequestWithUser
  ): Promise<Todo> {
    const ownerId = req.user.id;
    return this.todoService.updateTask(taskId, ownerId, todoData);
  }

  @Put(':taskId/assign')
  async assignTask(
    @Param('taskId') taskId: string,
    @Body(new ValidationPipe()) assignDto: AssignTodoDto,
    @Req() req: RequestWithUser
  ): Promise<Todo> {
    const ownerId = req.user.id;
    return this.todoService.assignTask(taskId, ownerId, assignDto);
  }

  @Delete(':taskId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTask(@Param('taskId') taskId: string, @Req() req: RequestWithUser): Promise<void> {
    const ownerId = req.user.id;
    await this.todoService.deleteTask(taskId, ownerId);
  }
}
