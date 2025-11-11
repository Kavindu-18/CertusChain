import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GenerateReportDto } from './dto';

@ApiTags('Compliance Reports')
@ApiBearerAuth()
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate ESG compliance report using AI' })
  generateReport(
    @CurrentUser('companyId') companyId: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: GenerateReportDto,
  ) {
    return this.reportsService.generateReport(companyId, userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all generated reports' })
  findAll(@CurrentUser('companyId') companyId: string) {
    return this.reportsService.findAll(companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Download a specific report' })
  findOne(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.reportsService.findOne(companyId, id);
  }
}
