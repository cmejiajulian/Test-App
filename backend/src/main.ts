import { ValidationPipe } from '@nestjs/common';
import { NestFactory }    from '@nestjs/core';
import { json }           from 'body-parser';
import { AppModule }      from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // → Middleware para conservar rawBody (webhooks)
  app.use(json({
    verify: (req: any, _res, buf) => { req.rawBody = buf.toString(); },
  }));

  app.enableCors({ origin: '*' });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const basePort = parseInt(process.env.PORT ?? '3002', 10);
  let port = basePort;
  try {
    await app.listen(port);
    console.log(`🚀 Backend corriendo en http://localhost:${port}`);
  } catch (err: any) {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️  Puerto ${port} en uso, probando con ${port + 1}…`);
      port++;
      await app.listen(port);
      console.log(`🚀 Backend corriendo en http://localhost:${port}`);
    } else {
      throw err;
    }
  }
}
bootstrap();
