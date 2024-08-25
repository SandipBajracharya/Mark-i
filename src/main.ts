import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import './config/dotenv.loader';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.setGlobalPrefix('api');    // for global prefix
  app.enableCors();
  await app.listen(process.env.APP_PORT);
}
bootstrap();
