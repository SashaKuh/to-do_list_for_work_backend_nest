import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum TodoDifficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

export enum TodoStatus {
  IN_PROGRESS = 'in-progress',
  DONE = 'done'
}

@Schema({
  collection: 'todo',
  timestamps: true,
  versionKey: false,
})
export class Todo {
  @Prop({
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  })
  title: string;

  @Prop({
    type: String,
    default: '',
    maxlength: 200
  })
  description?: string;

  @Prop({
    type: String,
    enum: TodoDifficulty,
    required: true
  })
  difficulty: TodoDifficulty;

  @Prop({
    type: String,
    enum: TodoStatus,
    default: TodoStatus.IN_PROGRESS
  })
  status: TodoStatus;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop({ type: String, required: true })
  ownerEmail: string;

  @Prop({ type: String, required: true })
  ownerName: string;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  assignedTo: Types.ObjectId | null;
}

export type TodoDocument = Todo & Document;
export const TodoSchema = SchemaFactory.createForClass(Todo);
