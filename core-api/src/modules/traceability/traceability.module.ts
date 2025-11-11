import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TraceabilityController } from './traceability.controller';
import { TraceabilityService } from './traceability.service';
import { RawMaterialBatch } from '@/database/entities/raw-material-batch.entity';
import { ProductionRun } from '@/database/entities/production-run.entity';
import { ProductionRunInput } from '@/database/entities/production-run-input.entity';
import { FinishedGoodBatch } from '@/database/entities/finished-good-batch.entity';
import { Supplier } from '@/database/entities/supplier.entity';
import { Factory } from '@/database/entities/factory.entity';
import { AuditLog } from '@/database/entities/audit-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RawMaterialBatch,
      ProductionRun,
      ProductionRunInput,
      FinishedGoodBatch,
      Supplier,
      Factory,
      AuditLog,
    ]),
  ],
  controllers: [TraceabilityController],
  providers: [TraceabilityService],
  exports: [TraceabilityService],
})
export class TraceabilityModule {}
