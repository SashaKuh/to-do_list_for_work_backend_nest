import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from '../schemas/todo.schema';
import { CreateTodoDto } from '../dto/create-todo.dto';

@Injectable()
export class TodoRepository {
  constructor(@InjectModel(Todo.name) private readonly todoModel: Model<Todo>) {}  // DIP: Залежність від абстракції (Model)

  async findAll(ownerId: string): Promise<Todo[]> {
    return this.todoModel.find({ 'owner._id': ownerId }).exec();
  }

  async findById(taskId: string, ownerId: string): Promise<Todo | null> {
    return this.todoModel.findOne({ id: taskId, 'owner._id': ownerId }).exec();
  }

  async create(owner: { _id: string; name: string; email: string }, todoData: CreateTodoDto): Promise<Todo> {
    const newTodo = new this.todoModel({
      owner,
      ...todoData,
    });
    return newTodo.save();
  }

  async update(taskId: string, ownerId: string, todoData: Partial<CreateTodoDto>): Promise<Todo | null> {
    return this.todoModel
      .findOneAndUpdate({ id: taskId, 'owner._id': ownerId }, todoData, { new: true })
      .exec();
  }

  async delete(taskId: string, ownerId: string): Promise<Todo | null> {
    return this.todoModel.findOneAndDelete({ id: taskId, 'owner._id': ownerId }).exec();
  }
}
