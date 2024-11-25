import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export enum TodoDifficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

export enum TodoStatus {
  IN_PROGRESS = 'in-progress',
  DONE = 'done'
}

@Schema({ timestamps: true, versionKey: false, collection: 'todo' })
export class Todo {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true, enum: TodoDifficulty })
  difficulty: TodoDifficulty;

  @Prop({ required: true, enum: TodoStatus })
  status: TodoStatus;

  @Prop({
    type: [{
      _id: { type: Types.ObjectId, ref: 'User', required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
    }],
    required: true,
  })
  owners: Array<{
    _id: Types.ObjectId;
    name: string;
    email: string;
  }>;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: String, required: false })
  comment?: string;

  @Prop({ type: Date, required: false })
  deadline?: Date;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);