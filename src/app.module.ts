import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TodoModule } from './todos/todo.module';
import { MongoDBModule } from './mongodb/mongodb.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongoDBModule,
    TodoModule,
    AuthModule,
  ],
})
export class AppModule {}