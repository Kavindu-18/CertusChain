import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IoTDevice } from '@/database/entities/iot-device.entity';
import { Factory } from '@/database/entities/factory.entity';
import { CreateDeviceDto, UpdateDeviceDto } from './dto';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(IoTDevice)
    private readonly deviceRepository: Repository<IoTDevice>,
    @InjectRepository(Factory)
    private readonly factoryRepository: Repository<Factory>,
  ) {}

  async create(companyId: string, createDeviceDto: CreateDeviceDto) {
    // Verify factory belongs to company
    const factory = await this.factoryRepository.findOne({
      where: { id: createDeviceDto.factory_id, company_id: companyId },
    });

    if (!factory) {
      throw new NotFoundException('Factory not found');
    }

    const device = this.deviceRepository.create(createDeviceDto);
    return this.deviceRepository.save(device);
  }

  async findAll(companyId: string) {
    return this.deviceRepository
      .createQueryBuilder('device')
      .innerJoin('device.factory', 'factory')
      .where('factory.company_id = :companyId', { companyId })
      .orderBy('device.created_at', 'DESC')
      .getMany();
  }

  async findOne(companyId: string, id: string) {
    const device = await this.deviceRepository
      .createQueryBuilder('device')
      .innerJoin('device.factory', 'factory')
      .where('device.id = :id', { id })
      .andWhere('factory.company_id = :companyId', { companyId })
      .getOne();

    if (!device) {
      throw new NotFoundException('Device not found');
    }

    return device;
  }

  async update(companyId: string, id: string, updateDeviceDto: UpdateDeviceDto) {
    const device = await this.findOne(companyId, id);
    Object.assign(device, updateDeviceDto);
    return this.deviceRepository.save(device);
  }

  async remove(companyId: string, id: string) {
    const device = await this.findOne(companyId, id);
    await this.deviceRepository.remove(device);
    return { message: 'Device deleted successfully' };
  }
}
