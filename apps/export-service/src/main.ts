import { NestFactory } from '@nestjs/core';
import { ExportServiceModule } from './export-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ExportServiceModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'POST',
  });
  await app.listen(3000);
}
bootstrap();
