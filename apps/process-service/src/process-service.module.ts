import { Module } from '@nestjs/common';
import { ProcessService } from './process-service.service';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleEntity } from './entity/vehicle.entity';
import { NotificationGateway } from 'apps/notification-service/src/notification-service.gateway';

@Module({
  imports: [
    //Configurations for Bull
    BullModule.forRoot({
      redis: {
        host: '127.0.0.1',
        port: 6379,
      },
    }),
    //Register queue
    BullModule.registerQueue({
      name: 'file-upload-queue',
    }),
    //Configurations for TypeORM
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234root',
      database: 'vehicleDataHub',
      entities: [VehicleEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([VehicleEntity]),
  ],
  providers: [ProcessService, NotificationGateway],
})
export class ProcessServiceModule { }
