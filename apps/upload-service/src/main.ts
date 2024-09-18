import { NestFactory } from '@nestjs/core';
import { UploadServiceModule } from './upload-service.module';
import { graphqlUploadExpress } from 'graphql-upload-ts';

async function bootstrap() {
  const app = await NestFactory.create(UploadServiceModule);
  app.use(graphqlUploadExpress({
    maxFileSize: 20000000,
    maxFiles: 1
  }));
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'POST',
  });
  await app.listen(3002);
}
bootstrap();
