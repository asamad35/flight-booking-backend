import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Setup CORS - adjust according to your frontend URL
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173'], // Add your frontend URLs
    credentials: true, // Allow cookies and authentication headers
  });

  // Use cookie-parser middleware
  app.use(cookieParser());

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip validated object of any properties that don't have decorators
      transform: true, // Automatically transform payloads to DTO instances
      forbidNonWhitelisted: true, // Throw errors if non-whitelisted properties are present
    }),
  );

  // Global prefix for all routes (optional)
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3333);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
