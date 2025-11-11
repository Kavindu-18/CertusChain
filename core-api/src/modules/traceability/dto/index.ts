import {
  IsString,
  IsUUID,
  IsOptional,
  IsNumber,
  IsDateString,
  IsArray,
  ValidateNested,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// Raw Material DTO
export class CreateRawMaterialDto {
  @ApiProperty()
  @IsUUID()
  supplier_id: string;

  @ApiProperty({ example: 'Recycled PET' })
  @IsString()
  material_name: string;

  @ApiProperty({ example: 'Fabric' })
  @IsString()
  @IsOptional()
  material_type?: string;

  @ApiProperty({ example: 'BATCH-2024-001' })
  @IsString()
  batch_number: string;

  @ApiProperty({ example: 500 })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 'kg', default: 'kg' })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  received_date: string;

  @ApiProperty({ required: false })
  @IsOptional()
  certifications?: Record<string, any>;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

// Production Run Input (for linking)
export class ProductionRunInputDto {
  @ApiProperty()
  @IsUUID()
  raw_material_batch_id: string;

  @ApiProperty({ example: 250 })
  @IsNumber()
  quantity_used: number;

  @ApiProperty({ example: 'kg', default: 'kg' })
  @IsString()
  @IsOptional()
  unit?: string;
}

// Production Run DTO
export class CreateProductionRunDto {
  @ApiProperty()
  @IsUUID()
  factory_id: string;

  @ApiProperty({ example: 'RUN-2024-001' })
  @IsString()
  run_number: string;

  @ApiProperty({ example: 'T-Shirt' })
  @IsString()
  @IsOptional()
  product_type?: string;

  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  start_date: string;

  @ApiProperty({ example: '2024-01-20', required: false })
  @IsDateString()
  @IsOptional()
  end_date?: string;

  @ApiProperty({ example: 1000 })
  @IsInt()
  @IsOptional()
  units_produced?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ type: [ProductionRunInputDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductionRunInputDto)
  raw_material_inputs: ProductionRunInputDto[];
}

// Finished Good DTO
export class CreateFinishedGoodDto {
  @ApiProperty()
  @IsUUID()
  production_run_id: string;

  @ApiProperty({ example: 'Eco-Friendly T-Shirt' })
  @IsString()
  product_name: string;

  @ApiProperty({ example: 'SKU-12345', required: false })
  @IsString()
  @IsOptional()
  product_sku?: string;

  @ApiProperty({ example: 500 })
  @IsInt()
  quantity: number;

  @ApiProperty({ example: 'pieces', default: 'pieces' })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiProperty({ example: '2024-01-20' })
  @IsDateString()
  production_date: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
