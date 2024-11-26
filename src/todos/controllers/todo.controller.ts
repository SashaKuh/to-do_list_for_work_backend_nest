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
import { Roles } from 'src/auth/util/roles.decorator';
import { UserRole } from 'src/auth/schemas/auth.schema';


// Repository Pattern (Інкапсуляція доступу до бази даних у спеціальному класі)
@Controller('todolists')
@UseGuards(AuthGuard)  // DIP: Залежність від абстракції (AuthGuard) для авторизації
export class TodoController {
  constructor(private readonly todoService: TodoService) {} // DIP: Сервіс передається через інверсію залежностей

  @Get()
  @Roles(UserRole.USER, UserRole.ADMIN)
  async getAllTasks(
    @Req() req: RequestWithUser,
  ): Promise<Todo[]> {
    const ownerId = req.user.id;
    const role = req.user.role;
    return this.todoService.getAllTasks(ownerId, role); // SRP: Контролер делегує логіку сервісу
  }

  @Get(':taskId')
  async getTaskById(@Param('taskId') taskId: string, @Req() req: RequestWithUser): Promise<Todo> {
    const ownerId = req.user.id;
    const role = req.user.role;
    return this.todoService.getTaskById(taskId, ownerId, role);  // SRP: Виклик бізнес-логіки з сервісу
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
    const role = req.user.role;
    return this.todoService.updateTask(taskId, ownerId, todoData, role);
  }

  @Put(':taskId/assign')
  async assignTask(
    @Param('taskId') taskId: string,
    @Body(new ValidationPipe()) assignDto: AssignTodoDto,
    @Req() req: RequestWithUser
  ): Promise<Todo> {
    const ownerId = req.user.id;
    const role = req.user.role;
    return this.todoService.assignTask(taskId, ownerId, assignDto, role);
  }

  @Delete(':taskId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTask(@Param('taskId') taskId: string, @Req() req: RequestWithUser): Promise<void> {
    const ownerId = req.user.id;
    const role = req.user.role;
    await this.todoService.deleteTask(taskId, ownerId, role);
  }
}
