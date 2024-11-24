import { Injectable, NotFoundException } from '@nestjs/common';
import { TodoRepository } from '../repositories/todo.repository';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { Todo } from '../schemas/todo.schema';

@Injectable()
export class TodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  async getAllTasks(): Promise<Todo[]> {
    console.log('є');
    return this.todoRepository.findAll();
  }

  async getTaskById(taskId: string): Promise<Todo> {
    const task = await this.todoRepository.findById(taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async createTask(todoData: CreateTodoDto): Promise<Todo> {
    return this.todoRepository.create(todoData);
  }

  async updateTask(taskId: string, todoData: Partial<Todo>): Promise<Todo> {
    const updatedTask = await this.todoRepository.update(taskId, todoData);
    if (!updatedTask) {
      throw new NotFoundException('Task not found');
    }
    return updatedTask;
  }

  async deleteTask(taskId: string): Promise<void> {
    const deletedTask = await this.todoRepository.delete(taskId);
    if (!deletedTask) {
      throw new NotFoundException('Task not found');
    }
  }
}