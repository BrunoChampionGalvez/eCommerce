import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './middlewares/logger.middleware';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Documentación Ecommerce NestJS App')
    .setDescription('Esta es la documentación de una aplicación back end sobre un ecommerce, hecha como parte del proyecto integrador del módulo 4 del bootcamp Henry.')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build()
  
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api', app, document)

  app.use(loggerGlobal)
  app.useGlobalPipes(new ValidationPipe({whitelist: true}))
  await app.listen(3000);
}
bootstrap();
