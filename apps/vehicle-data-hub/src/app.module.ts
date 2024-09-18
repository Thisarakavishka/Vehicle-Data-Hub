import { IntrospectAndCompose } from '@apollo/gateway';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    //Configurations for GraphQL
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      server: {
        csrfPrevention: false,
      },
      gateway: {
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            //Subgraps
            { name: 'upload-service', url: 'http://localhost:3002/graphql', },
            { name: 'vehicle-service', url: 'http://localhost:3005/graphql', },
          ]
        }),
      }
    })
  ],
  providers: [],
})
export class AppModule { }
