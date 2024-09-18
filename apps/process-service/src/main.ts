import { NestFactory } from '@nestjs/core';
import { ProcessServiceModule } from './process-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ProcessServiceModule);
  await app.listen(3003);
}
bootstrap();
