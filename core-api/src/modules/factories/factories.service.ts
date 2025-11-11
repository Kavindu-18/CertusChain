import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Factory } from '@/database/entities/factory.entity';
import { CreateFactoryDto, UpdateFactoryDto } from './dto';

@Injectable()
export class FactoriesService {
  constructor(
    @InjectRepository(Factory)
    private readonly factoryRepository: Repository<Factory>,
  ) {}

  async create(companyId: string, createFactoryDto: CreateFactoryDto) {
    const factory = this.factoryRepository.create({
      ...createFactoryDto,
      company_id: companyId,
    });
    return this.factoryRepository.save(factory);
  }

  async findAll(companyId: string) {
    return this.factoryRepository.find({
      where: { company_id: companyId },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(companyId: string, id: string) {
    const factory = await this.factoryRepository.findOne({
      where: { id, company_id: companyId },
    });

    if (!factory) {
      throw new NotFoundException('Factory not found');
    }

    return factory;
  }

  async update(companyId: string, id: string, updateFactoryDto: UpdateFactoryDto) {
    const factory = await this.findOne(companyId, id);

    Object.assign(factory, updateFactoryDto);
    return this.factoryRepository.save(factory);
  }

  async remove(companyId: string, id: string) {
    const factory = await this.findOne(companyId, id);
    await this.factoryRepository.remove(factory);
    return { message: 'Factory deleted successfully' };
  }
}
