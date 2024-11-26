import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');

  // Налаштовуємо CORS для дозволу доступу лише з конкретного домену
  app.enableCors({
    origin: '*', // домен, який має право доступати ваше API
    methods: 'GET, POST, PUT, DELETE', // дозволені методи
    allowedHeaders: 'Content-Type, Authorization', // дозволені заголовки
  });

  const config = new DocumentBuilder()
    .setTitle('Todo API')
    .setDescription('API for managing todo tasks')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Вказуємо порт, на якому сервер буде слухати
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
