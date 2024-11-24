import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from '../schemas/todo.schema';
import { CreateTodoDto } from '../dto/create-todo.dto';

@Injectable()
export class TodoRepository {
  constructor(
    @InjectModel(Todo.name) private todoModel: Model<Todo>
  ) {}

  async findAll(): Promise<Todo[]> {
    return this.todoModel.find().exec();
  }

  async findById(id: string): Promise<Todo | null> {
    return this.todoModel.findById(id).exec();
  }

  async create(todoData: CreateTodoDto): Promise<Todo> {
    const newTodo = new this.todoModel(todoData);
    return newTodo.save();
  }

  async update(id: string, todoData: Partial<Todo>): Promise<Todo | null> {
    return this.todoModel.findByIdAndUpdate(id, todoData, { new: true }).exec();
  }

  async delete(id: string): Promise<Todo | null> {
    return this.todoModel.findByIdAndDelete(id).exec();
  }
}