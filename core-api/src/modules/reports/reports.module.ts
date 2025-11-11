import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ComplianceReport } from '@/database/entities/compliance-report.entity';
import { AuditLog } from '@/database/entities/audit-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ComplianceReport, AuditLog]),
    HttpModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
