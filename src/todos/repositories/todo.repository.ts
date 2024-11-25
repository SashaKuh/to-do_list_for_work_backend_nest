import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from '../schemas/todo.schema';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';
import { AssignTodoDto } from '../dto/assign-todo.dto';
import { User } from 'src/auth/schemas/auth.schema';

@Injectable()
export class TodoRepository {
  constructor(
    @InjectModel(Todo.name) private readonly todoModel: Model<Todo>,
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) { }  // DIP: Залежність від абстракції (Model)

  async findAll(ownerId: string): Promise<Todo[]> {
    return this.todoModel.find({ 'owners._id': ownerId }).exec();
  }

  async findById(taskId: string, ownerId: string): Promise<Todo | null> {
    return this.todoModel.findOne({ _id: taskId, 'owners._id': ownerId }).exec();
  }

  async create(owner: { _id: string; name: string; email: string }, todoData: CreateTodoDto): Promise<Todo> {
    const newTodo = new this.todoModel({
      owners: [owner],
      ...todoData,
    });
    return newTodo.save();
  }

  async update(taskId: string, ownerId: string, todoData: Partial<UpdateTodoDto>): Promise<Todo | null> {
    return this.todoModel
      .findOneAndUpdate({ _id: taskId, 'owners._id': ownerId }, todoData, { new: true })
      .exec();
  }

  async assignTask(taskId: string, ownerId: string, assignDto: AssignTodoDto): Promise<Todo | null> {
    const user = await this.userModel.findOne({ email: assignDto.email });
  
    if (!user) {
      return null;
    }

    return this.todoModel.findOneAndUpdate(
      {
        _id: taskId,
        'owners._id': { $ne: user._id },
        owners: { $elemMatch: { _id: ownerId } }
      },
      {
        $addToSet: {
          owners: {
            _id: user._id,
            name: user.name,
            email: user.email
          }
        }
      },
      { new: true }
    ).exec();
  }

  async delete(taskId: string, ownerId: string): Promise<Todo | null> {
    return this.todoModel.findOneAndDelete({ _id: taskId, 'owners._id': ownerId }).exec();
  }

  
}
