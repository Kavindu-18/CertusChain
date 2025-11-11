import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngestController } from './ingest.controller';
import { IngestService } from './ingest.service';
import { EnergyMetric } from '@/database/entities/energy-metric.entity';
import { WaterMetric } from '@/database/entities/water-metric.entity';
import { WasteMetric } from '@/database/entities/waste-metric.entity';
import { IoTDevice } from '@/database/entities/iot-device.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EnergyMetric, WaterMetric, WasteMetric, IoTDevice])],
  controllers: [IngestController],
  providers: [IngestService],
  exports: [IngestService],
})
export class IngestModule {}
