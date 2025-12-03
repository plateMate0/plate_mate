import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swagger } from './utils/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');

  /* --- CORS --- */
  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useStaticAssets(join(__dirname, '..', '..', '..', 'uploads'));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  await swagger(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
