import { IsString, IsOptional, IsNumber, IsEmail } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateFactoryDto {
  @ApiProperty({ example: 'Factory 1 - Colombo' })
  @IsString()
  name: string;

  @ApiProperty({ example: '123 Main Street' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 'Colombo' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: 'Sri Lanka' })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ example: 6.9271 })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({ example: 79.8612 })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({ example: 'John Manager' })
  @IsString()
  @IsOptional()
  contact_person?: string;

  @ApiProperty({ example: 'manager@factory.lk' })
  @IsEmail()
  @IsOptional()
  contact_email?: string;

  @ApiProperty({ example: '+94771234567' })
  @IsString()
  @IsOptional()
  contact_phone?: string;
}

export class UpdateFactoryDto extends PartialType(CreateFactoryDto) {}
