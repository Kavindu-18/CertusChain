import { IsString, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ReportType {
  GRI = 'GRI',
  CSDDD = 'CSDDD',
}

export class GenerateReportDto {
  @ApiProperty({ enum: ReportType, example: 'GRI' })
  @IsEnum(ReportType)
  report_type: ReportType;

  @ApiProperty({ example: '2024-01-01' })
  @IsDateString()
  start_date: string;

  @ApiProperty({ example: '2024-12-31' })
  @IsDateString()
  end_date: string;
}
