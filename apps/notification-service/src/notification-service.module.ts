import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification-service.gateway';

@Module({
  imports: [],
  providers: [NotificationGateway],
  exports: [NotificationGateway],
})
export class NotificationServiceModule { }
