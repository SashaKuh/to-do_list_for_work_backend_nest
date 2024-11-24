import { IsMongoId } from 'class-validator';

export class AssignTodoDto {
  @IsMongoId()
  assignedTo: string;
} 