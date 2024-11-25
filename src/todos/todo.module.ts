import { Module } from '@nestjs/common';
import { TodoController } from './controllers/todo.controller';
import { TodoService } from './services/todo.service';
import { TodoRepository } from './repositories/todo.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo, TodoSchema } from './schemas/todo.schema';
import { AuthModule } from '../auth/auth.module'; 
import { BlacklistedToken, BlacklistedTokenSchema } from '../auth/schemas/blacklisted-token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Todo.name, schema: TodoSchema },
      
      { name: BlacklistedToken.name, schema: BlacklistedTokenSchema },
    ]),
    AuthModule, 
  ],
  controllers: [TodoController],
  providers: [TodoService, TodoRepository],
})
export class TodoModule {}