import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './filters/http-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Setup CORS - adjust according to your frontend URL
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://flight-booking-frontend-ten.vercel.app',
    ], // Add your frontend URLs
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

  // Apply global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('Flight Booking API')
    .setDescription('The Flight Booking API documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This is a key to be used in @ApiBearerAuth() decorator
    )
    .build();

  // Create the Swagger document
  const document = SwaggerModule.createDocument(app, config, {
    include: [], // Empty array means only controllers with explicit @ApiTags will be included
    ignoreGlobalPrefix: false,
    deepScanRoutes: true,
  });

  // Remove specific controller paths from the document
  if (document && document.paths) {
    // Remove routes that start with /api/app (but not flights anymore)
    Object.keys(document.paths).forEach((path) => {
      if (path.startsWith('/api/app')) {
        delete document.paths[path];
      }
    });
  }

  // Remove specific schemas from the Swagger documentation
  try {
    if (document?.components?.schemas) {
      // Remove 'Object' schema if it exists
      if ('Object' in document.components.schemas) {
        delete document.components.schemas['Object'];
      }

      // Add any other schemas you want to remove here
      // Example: delete document.components.schemas['UnwantedDto'];
    }
  } catch (error) {
    console.warn('Error cleaning up Swagger schemas:', error);
  }

  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3333);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
