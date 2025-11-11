import { IsString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { DeviceType } from '@/database/entities/iot-device.entity';

export class CreateDeviceDto {
  @ApiProperty()
  @IsUUID()
  factory_id: string;

  @ApiProperty()
  @IsString()
  device_name: string;

  @ApiProperty()
  @IsString()
  device_id: string;

  @ApiProperty({ enum: DeviceType })
  @IsEnum(DeviceType)
  device_type: DeviceType;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  location?: string;
}

export class UpdateDeviceDto extends PartialType(CreateDeviceDto) {}
