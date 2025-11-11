import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IngestService } from './ingest.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IoTDataDto } from './dto';

@ApiTags('IoT Data Ingestion')
@ApiBearerAuth()
@Controller('ingest')
export class IngestController {
  constructor(private readonly ingestService: IngestService) {}

  @Post('iot')
  @ApiOperation({ summary: 'Ingest IoT sensor data (high-throughput endpoint)' })
  ingestIoT(
    @CurrentUser('companyId') companyId: string,
    @Body() data: IoTDataDto[],
  ) {
    return this.ingestService.ingestIoTData(companyId, data);
  }
}
