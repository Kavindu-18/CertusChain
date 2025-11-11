import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FactoriesService } from './factories.service';
import { CreateFactoryDto, UpdateFactoryDto } from './dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Factories')
@ApiBearerAuth()
@Controller('factories')
export class FactoriesController {
  constructor(private readonly factoriesService: FactoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new factory' })
  create(
    @CurrentUser('companyId') companyId: string,
    @Body() createFactoryDto: CreateFactoryDto,
  ) {
    return this.factoriesService.create(companyId, createFactoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all factories for the company' })
  findAll(@CurrentUser('companyId') companyId: string) {
    return this.factoriesService.findAll(companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific factory' })
  findOne(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.factoriesService.findOne(companyId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a factory' })
  update(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
    @Body() updateFactoryDto: UpdateFactoryDto,
  ) {
    return this.factoriesService.update(companyId, id, updateFactoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a factory' })
  remove(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.factoriesService.remove(companyId, id);
  }
}
