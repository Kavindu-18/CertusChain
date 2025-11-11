import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TraceabilityService } from './traceability.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import {
  CreateRawMaterialDto,
  CreateProductionRunDto,
  CreateFinishedGoodDto,
} from './dto';

@ApiTags('Traceability')
@Controller('trace')
export class TraceabilityController {
  constructor(private readonly traceabilityService: TraceabilityService) {}

  @Post('raw-material')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new raw material batch' })
  createRawMaterial(
    @CurrentUser('companyId') companyId: string,
    @Body() dto: CreateRawMaterialDto,
  ) {
    return this.traceabilityService.createRawMaterial(companyId, dto);
  }

  @Post('production-run')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a production run and link raw materials' })
  createProductionRun(
    @CurrentUser('companyId') companyId: string,
    @Body() dto: CreateProductionRunDto,
  ) {
    return this.traceabilityService.createProductionRun(companyId, dto);
  }

  @Post('finished-good')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create finished good batch with QR code' })
  createFinishedGood(
    @CurrentUser('companyId') companyId: string,
    @Body() dto: CreateFinishedGoodDto,
  ) {
    return this.traceabilityService.createFinishedGood(companyId, dto);
  }

  @Public()
  @Get(':qr_code_id')
  @ApiOperation({ summary: 'Get full traceability chain (PUBLIC - no auth)' })
  getTraceability(@Param('qr_code_id') qrCodeId: string) {
    return this.traceabilityService.getTraceabilityByQrCode(qrCodeId);
  }
}
