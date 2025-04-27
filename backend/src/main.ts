import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // 1. Crea la aplicación Nest a partir de AppModule
  const app = await NestFactory.create(AppModule);

  // 2. Habilita CORS para tu frontend (http://localhost:3000)
  app.enableCors({
    origin: 'http://localhost:3000',
  });

  // 3. Valida automáticamente todos los DTOs entrantes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,             // elimina propiedades no declaradas en el DTO
      forbidNonWhitelisted: true,  // arroja error si llegan props extrañas
      transform: true,             // transforma strings a tipos (p.ej. "123" → 123)
    }),
  );

  // 4. Arranca en el puerto definido en .env (PORT) o en 3001 por defecto
  const port = process.env.PORT ? +process.env.PORT : 3001;
  await app.listen(port);
  console.log(`🚀 Backend corriendo en http://localhost:${port}`);
}

bootstrap();
