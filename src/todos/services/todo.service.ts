import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { TodoRepository } from '../repositories/todo.repository';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { Todo } from '../schemas/todo.schema';
import { AssignTodoDto } from '../dto/assign-todo.dto';

@Injectable()
export class TodoService {
  constructor(private readonly todoRepository: TodoRepository) { } // DIP: Сервіс залежить від репозиторію, а не напряму від бази

  async getAllTasks(ownerId: string, role: string): Promise<Todo[]> {
    return this.todoRepository.findAll(ownerId, role); // SRP: Відповідальність за отримання списку задач
  }

  async getTaskById(taskId: string, ownerId: string, role: string): Promise<Todo> {
    const task = await this.todoRepository.findById(taskId, ownerId, role);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async createTask(owner: { id: string; name: string; email: string }, todoData: CreateTodoDto): Promise<Todo> {
    if (!todoData.title || !todoData.difficulty || !todoData.status) {
      throw new BadRequestException('Invalid data provided');
    }
    return this.todoRepository.create(
      { _id: owner.id, name: owner.name, email: owner.email },
      todoData
    );
  }

  async updateTask(taskId: string, ownerId: string, todoData: Partial<CreateTodoDto>, role: string): Promise<Todo> {
    const updatedTask = await this.todoRepository.update(taskId, ownerId, todoData, role);
    if (!updatedTask) {
      throw new NotFoundException('Task not found')
    }
    return updatedTask;
  }

  async assignTask(
    taskId: string,
    ownerId: string,
    assignDto: AssignTodoDto,
    role: string
  ): Promise<Todo> {
    const assignedTask = await this.todoRepository.assignTask(taskId, ownerId, assignDto, role);
    
    if (!assignedTask) {
      throw new BadRequestException('Task assignment failed. User may not exist or is already an owner.');
    }
    
    return assignedTask;
  }

  async deleteTask(taskId: string, ownerId: string, role: string): Promise<void> {
    const deletedTask = await this.todoRepository.delete(taskId, ownerId, role);
    if (!deletedTask) {
      throw new NotFoundException('Task not found');
    }
  }
}
