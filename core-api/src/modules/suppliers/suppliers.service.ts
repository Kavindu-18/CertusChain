import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from '@/database/entities/supplier.entity';
import { CreateSupplierDto, UpdateSupplierDto } from './dto';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  async create(companyId: string, createSupplierDto: CreateSupplierDto) {
    const supplier = this.supplierRepository.create({
      ...createSupplierDto,
      company_id: companyId,
    });
    return this.supplierRepository.save(supplier);
  }

  async findAll(companyId: string) {
    return this.supplierRepository.find({
      where: { company_id: companyId },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(companyId: string, id: string) {
    const supplier = await this.supplierRepository.findOne({
      where: { id, company_id: companyId },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    return supplier;
  }

  async update(companyId: string, id: string, updateSupplierDto: UpdateSupplierDto) {
    const supplier = await this.findOne(companyId, id);
    Object.assign(supplier, updateSupplierDto);
    return this.supplierRepository.save(supplier);
  }

  async remove(companyId: string, id: string) {
    const supplier = await this.findOne(companyId, id);
    await this.supplierRepository.remove(supplier);
    return { message: 'Supplier deleted successfully' };
  }
}
