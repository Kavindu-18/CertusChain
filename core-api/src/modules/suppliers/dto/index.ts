import { IsString, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateSupplierDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  contact_person?: string;

  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
  contact_email?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  contact_phone?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  certifications?: string;
}

export class UpdateSupplierDto extends PartialType(CreateSupplierDto) {}
