import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IoTDataDto {
  @ApiProperty({ example: 'DEVICE-ENERGY-001' })
  @IsString()
  device_id: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  @IsDateString()
  timestamp: string;

  // Energy metrics
  @ApiProperty({ required: false, example: 5.2 })
  @IsNumber()
  @IsOptional()
  kwh?: number;

  @ApiProperty({ required: false, example: 230 })
  @IsNumber()
  @IsOptional()
  voltage?: number;

  @ApiProperty({ required: false, example: 10.5 })
  @IsNumber()
  @IsOptional()
  current?: number;

  @ApiProperty({ required: false, example: 0.95 })
  @IsNumber()
  @IsOptional()
  power_factor?: number;

  // Water metrics
  @ApiProperty({ required: false, example: 150.5 })
  @IsNumber()
  @IsOptional()
  flow_rate?: number;

  @ApiProperty({ required: false, example: 1000 })
  @IsNumber()
  @IsOptional()
  volume_liters?: number;

  @ApiProperty({ required: false, example: 7.2 })
  @IsNumber()
  @IsOptional()
  ph?: number;

  @ApiProperty({ required: false, example: 450 })
  @IsNumber()
  @IsOptional()
  tds?: number;

  @ApiProperty({ required: false, example: 25.5 })
  @IsNumber()
  @IsOptional()
  temperature?: number;

  // Waste metrics
  @ApiProperty({ required: false, example: 'Fabric Waste' })
  @IsString()
  @IsOptional()
  waste_type?: string;

  @ApiProperty({ required: false, example: 50.5 })
  @IsNumber()
  @IsOptional()
  weight_kg?: number;

  @ApiProperty({ required: false, example: 'Recycling' })
  @IsString()
  @IsOptional()
  disposal_method?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
