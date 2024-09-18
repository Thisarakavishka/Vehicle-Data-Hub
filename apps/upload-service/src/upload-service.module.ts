import { Module } from '@nestjs/common';
import { UploadService } from './upload-service.service';
import { BullModule } from '@nestjs/bull';
import { UploadServiceResolver } from './upload-service.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    //Configurations for GraphQL
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2
      },
      csrfPrevention: false,
    }),
    //Configurations for Bull
    BullModule.forRoot({
      redis: {
        host: '127.0.0.1',
        port: 6379,
      },
    }),
    //Register Bull Queue
    BullModule.registerQueue({
      name: 'file-upload-queue',
    }),
  ],
  providers: [UploadService, UploadServiceResolver,],
})
export class UploadServiceModule { }
