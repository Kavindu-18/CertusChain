import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import { IoTDevice } from '@/database/entities/iot-device.entity';
import { Factory } from '@/database/entities/factory.entity';
import { AuditLog } from '@/database/entities/audit-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IoTDevice, Factory, AuditLog])],
  controllers: [DevicesController],
  providers: [DevicesService],
  exports: [DevicesService],
})
export class DevicesModule {}
