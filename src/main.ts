import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips away properties that don't have decorators
      forbidNonWhitelisted: true, // Throws an error if non-whitelisted properties are present
      transform: true, // Automatically transforms payloads to match DTO class types
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
