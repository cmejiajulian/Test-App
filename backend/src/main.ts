import { ValidationPipe } from '@nestjs/common';
import { NestFactory }     from '@nestjs/core';
import { AppModule }       from './app.module';

async function bootstrap() {
  // 1. Inicializa la app
  const app = await NestFactory.create(AppModule);

  // 2. Habilita CORS para tu frontend
  app.enableCors({ origin: '*' });


  // 3. Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 4. Lee PORT de .env o usa 3001 si no está definido
  const port = process.env.PORT ? +process.env.PORT : 3002;
  await app.listen(port);
  console.log(`🚀 Backend corriendo en http://localhost:${port}`);
}

bootstrap();
