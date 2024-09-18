import { NestFactory } from '@nestjs/core';
import { VehicleServiceModule } from './vehicle-service.module';

async function bootstrap() {
  const app = await NestFactory.create(VehicleServiceModule);
  await app.listen(3005);
}
bootstrap();
