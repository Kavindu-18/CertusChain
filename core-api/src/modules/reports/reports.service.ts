import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { ComplianceReport } from '@/database/entities/compliance-report.entity';
import { GenerateReportDto } from './dto';

@Injectable()
export class ReportsService {
  private readonly aiServiceUrl: string;

  constructor(
    @InjectRepository(ComplianceReport)
    private readonly reportRepository: Repository<ComplianceReport>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.aiServiceUrl = this.configService.get('AI_SERVICE_URL');
  }

  async generateReport(companyId: string, userId: string, dto: GenerateReportDto) {
    try {
      // Call Python AI/ML service to generate report
      const response = await firstValueFrom(
        this.httpService.post(`${this.aiServiceUrl}/ai/generate-report`, {
          company_id: companyId,
          start_date: dto.start_date,
          end_date: dto.end_date,
          report_type: dto.report_type,
        }),
      );

      if (!response.data || !response.data.report_content) {
        throw new InternalServerErrorException('AI service returned invalid response');
      }

      // Save report metadata
      const report = this.reportRepository.create({
        company_id: companyId,
        report_type: dto.report_type,
        start_date: new Date(dto.start_date),
        end_date: new Date(dto.end_date),
        report_content: response.data.report_content,
        generated_by: userId,
      });

      const savedReport = await this.reportRepository.save(report);

      return {
        id: savedReport.id,
        report_type: savedReport.report_type,
        start_date: savedReport.start_date,
        end_date: savedReport.end_date,
        report_content: savedReport.report_content,
        created_at: savedReport.created_at,
        metrics: response.data.metrics || {},
      };
    } catch (error) {
      console.error('Report generation failed:', error);
      throw new InternalServerErrorException(
        `Failed to generate report: ${error.message}`,
      );
    }
  }

  async findAll(companyId: string) {
    return this.reportRepository.find({
      where: { company_id: companyId },
      select: ['id', 'report_type', 'start_date', 'end_date', 'created_at'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(companyId: string, id: string) {
    const report = await this.reportRepository.findOne({
      where: { id, company_id: companyId },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return report;
  }
}
