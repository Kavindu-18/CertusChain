import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DevicesService } from './devices.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateDeviceDto, UpdateDeviceDto } from './dto';

@ApiTags('IoT Devices')
@ApiBearerAuth()
@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post()
  create(@CurrentUser('companyId') companyId: string, @Body() dto: CreateDeviceDto) {
    return this.devicesService.create(companyId, dto);
  }

  @Get()
  findAll(@CurrentUser('companyId') companyId: string) {
    return this.devicesService.findAll(companyId);
  }

  @Get(':id')
  findOne(@CurrentUser('companyId') companyId: string, @Param('id') id: string) {
    return this.devicesService.findOne(companyId, id);
  }

  @Put(':id')
  update(@CurrentUser('companyId') companyId: string, @Param('id') id: string, @Body() dto: UpdateDeviceDto) {
    return this.devicesService.update(companyId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser('companyId') companyId: string, @Param('id') id: string) {
    return this.devicesService.remove(companyId, id);
  }
}
