import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FactoriesController } from './factories.controller';
import { FactoriesService } from './factories.service';
import { Factory } from '@/database/entities/factory.entity';
import { AuditLog } from '@/database/entities/audit-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Factory, AuditLog])],
  controllers: [FactoriesController],
  providers: [FactoriesService],
  exports: [FactoriesService],
})
export class FactoriesModule {}
