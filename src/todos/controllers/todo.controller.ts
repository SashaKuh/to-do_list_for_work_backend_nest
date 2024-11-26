import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
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

@ApiTags('Todo Tasks Management') // Додаємо групування в Swagger
@Controller('todolists')
@UseGuards(AuthGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get all tasks', 
    description: 'Retrieve all tasks for the current user. Admins can see all tasks.' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of tasks successfully retrieved',
    type: Todo, 
    isArray: true 
  })
  @Roles(UserRole.USER, UserRole.ADMIN)
  async getAllTasks(
    @Req() req: RequestWithUser,
  ): Promise<Todo[]> {
    const ownerId = req.user.id;
    const role = req.user.role;
    return this.todoService.getAllTasks(ownerId, role);
  }

  @Get(':taskId')
  @ApiOperation({ 
    summary: 'Get task by ID', 
    description: 'Retrieve a specific task by its ID. Users can only access their own tasks.' 
  })
  @ApiParam({ 
    name: 'taskId', 
    description: 'Unique identifier of the task',
    type: String 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Task successfully retrieved',
    type: Todo 
  })
  async getTaskById(
    @Param('taskId') taskId: string, 
    @Req() req: RequestWithUser
  ): Promise<Todo> {
    const ownerId = req.user.id;
    const role = req.user.role;
    return this.todoService.getTaskById(taskId, ownerId, role);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Create a new task', 
    description: 'Create a new task for the current user' 
  })
  @ApiBody({ 
    type: CreateTodoDto,
    description: 'Task creation data' 
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Task successfully created',
    type: Todo 
  })
  async createTask(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) todoData: CreateTodoDto, 
    @Req() req: RequestWithUser
  ): Promise<Todo> {
    const owner = { id: req.user.id, name: req.user.name, email: req.user.email };
    return this.todoService.createTask(owner, todoData);
  }

  @Put(':taskId')
  @ApiOperation({ 
    summary: 'Update a task', 
    description: 'Update an existing task. Users can only update their own tasks.' 
  })
  @ApiParam({ 
    name: 'taskId', 
    description: 'Unique identifier of the task to update',
    type: String 
  })
  @ApiBody({ 
    type: UpdateTodoDto,
    description: 'Task update data' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Task successfully updated',
    type: Todo 
  })
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
  @ApiOperation({ 
    summary: 'Assign a task to another user', 
    description: 'Assign a task to another user. Admins have full access, users have limited access.' 
  })
  @ApiParam({ 
    name: 'taskId', 
    description: 'Unique identifier of the task to assign',
    type: String 
  })
  @ApiBody({ 
    type: AssignTodoDto,
    description: 'User assignment data' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Task successfully assigned',
    type: Todo 
  })
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
  @ApiOperation({ 
    summary: 'Delete a task', 
    description: 'Delete an existing task. Users can only delete their own tasks.' 
  })
  @ApiParam({ 
    name: 'taskId', 
    description: 'Unique identifier of the task to delete',
    type: String 
  })
  @ApiResponse({ 
    status: 204, 
    description: 'Task successfully deleted' 
  })
  async deleteTask(
    @Param('taskId') taskId: string, 
    @Req() req: RequestWithUser
  ): Promise<void> {
    const ownerId = req.user.id;
    const role = req.user.role;
    await this.todoService.deleteTask(taskId, ownerId, role);
  }
}