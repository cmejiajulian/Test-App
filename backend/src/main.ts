// backend/src/main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory }    from '@nestjs/core';
import { AppModule }      from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: '*' });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // 1) Lee el puerto de .env o usa 3002
  const basePort = process.env.PORT ? +process.env.PORT : 3002;

  // 2) Intenta levantar en basePort; si está en uso, prueba basePort+1
  let port = basePort;
  try {
    await app.listen(port);
    console.log(`🚀 Backend corriendo en http://localhost:${port}`);
  } catch (err: any) {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️  Puerto ${port} en uso, probando con ${port + 1}…`);
      port = port + 1;
      await app.listen(port);
      console.log(`🚀 Backend corriendo en http://localhost:${port}`);
    } else {
      throw err;
    }
  }
}

bootstrap();
