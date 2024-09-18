import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle-service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { VehicleServiceResolver } from './vehicle-service.resolver';

@Module({
  imports: [
    //Configurations for GraphQL
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      }
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
    TypeOrmModule.forFeature([Vehicle])
  ],
  providers: [VehicleService, VehicleServiceResolver],
})
export class VehicleServiceModule { }
