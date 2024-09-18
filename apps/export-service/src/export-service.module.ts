import { Module } from '@nestjs/common';
import { ExportService } from './export-service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entity/vehicle.entity';
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
    //Configurations for TypeORM
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234root',
      database: 'vehicleDataHub',
      entities: [Vehicle],
      synchronize: false, //only use true in dev mood
    }),
    TypeOrmModule.forFeature([Vehicle]),
  ],
  providers: [ExportService],
})
export class ExportServiceModule {}
