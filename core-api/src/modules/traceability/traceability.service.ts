import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { nanoid } from 'nanoid';
import { RawMaterialBatch } from '@/database/entities/raw-material-batch.entity';
import { ProductionRun } from '@/database/entities/production-run.entity';
import { ProductionRunInput } from '@/database/entities/production-run-input.entity';
import { FinishedGoodBatch } from '@/database/entities/finished-good-batch.entity';
import { Supplier } from '@/database/entities/supplier.entity';
import { Factory } from '@/database/entities/factory.entity';
import {
  CreateRawMaterialDto,
  CreateProductionRunDto,
  CreateFinishedGoodDto,
} from './dto';

@Injectable()
export class TraceabilityService {
  constructor(
    @InjectRepository(RawMaterialBatch)
    private readonly rawMaterialRepository: Repository<RawMaterialBatch>,
    @InjectRepository(ProductionRun)
    private readonly productionRunRepository: Repository<ProductionRun>,
    @InjectRepository(ProductionRunInput)
    private readonly productionRunInputRepository: Repository<ProductionRunInput>,
    @InjectRepository(FinishedGoodBatch)
    private readonly finishedGoodRepository: Repository<FinishedGoodBatch>,
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    @InjectRepository(Factory)
    private readonly factoryRepository: Repository<Factory>,
  ) {}

  // Create Raw Material Batch
  async createRawMaterial(companyId: string, dto: CreateRawMaterialDto) {
    // Verify supplier belongs to company
    const supplier = await this.supplierRepository.findOne({
      where: { id: dto.supplier_id, company_id: companyId },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    const rawMaterial = this.rawMaterialRepository.create(dto);
    return this.rawMaterialRepository.save(rawMaterial);
  }

  // Create Production Run with inputs (many-to-many linking)
  async createProductionRun(companyId: string, dto: CreateProductionRunDto) {
    // Verify factory belongs to company
    const factory = await this.factoryRepository.findOne({
      where: { id: dto.factory_id, company_id: companyId },
    });

    if (!factory) {
      throw new NotFoundException('Factory not found');
    }

    // Create production run
    const productionRun = this.productionRunRepository.create({
      factory_id: dto.factory_id,
      run_number: dto.run_number,
      product_type: dto.product_type,
      start_date: dto.start_date,
      end_date: dto.end_date,
      units_produced: dto.units_produced,
      notes: dto.notes,
    });

    const savedRun = await this.productionRunRepository.save(productionRun);

    // Link raw material batches
    if (dto.raw_material_inputs && dto.raw_material_inputs.length > 0) {
      const inputs = dto.raw_material_inputs.map((input) =>
        this.productionRunInputRepository.create({
          production_run_id: savedRun.id,
          raw_material_batch_id: input.raw_material_batch_id,
          quantity_used: input.quantity_used,
          unit: input.unit,
        }),
      );

      await this.productionRunInputRepository.save(inputs);
    }

    return this.getProductionRunWithDetails(savedRun.id);
  }

  // Create Finished Good Batch with auto-generated QR code
  async createFinishedGood(companyId: string, dto: CreateFinishedGoodDto) {
    // Verify production run exists and belongs to company
    const productionRun = await this.productionRunRepository
      .createQueryBuilder('run')
      .innerJoin('run.factory', 'factory')
      .where('run.id = :runId', { runId: dto.production_run_id })
      .andWhere('factory.company_id = :companyId', { companyId })
      .getOne();

    if (!productionRun) {
      throw new NotFoundException('Production run not found');
    }

    // Generate unique QR code ID
    const qrCodeId = `CC-${nanoid(12)}`;

    const finishedGood = this.finishedGoodRepository.create({
      ...dto,
      qr_code_id: qrCodeId,
    });

    return this.finishedGoodRepository.save(finishedGood);
  }

  // Public endpoint: Get full traceability chain by QR code
  async getTraceabilityByQrCode(qrCodeId: string) {
    const finishedGood = await this.finishedGoodRepository.findOne({
      where: { qr_code_id: qrCodeId },
      relations: ['production_run', 'production_run.factory'],
    });

    if (!finishedGood) {
      throw new NotFoundException('Product not found');
    }

    // Get production run inputs with raw materials and suppliers
    const productionInputs = await this.productionRunInputRepository.find({
      where: { production_run_id: finishedGood.production_run.id },
      relations: ['raw_material_batch', 'raw_material_batch.supplier'],
    });

    return {
      finished_good: {
        qr_code_id: finishedGood.qr_code_id,
        product_name: finishedGood.product_name,
        product_sku: finishedGood.product_sku,
        quantity: finishedGood.quantity,
        unit: finishedGood.unit,
        production_date: finishedGood.production_date,
      },
      production_run: {
        run_number: finishedGood.production_run.run_number,
        product_type: finishedGood.production_run.product_type,
        start_date: finishedGood.production_run.start_date,
        end_date: finishedGood.production_run.end_date,
        units_produced: finishedGood.production_run.units_produced,
        factory: {
          name: finishedGood.production_run.factory.name,
          city: finishedGood.production_run.factory.city,
          country: finishedGood.production_run.factory.country,
        },
      },
      raw_materials: productionInputs.map((input) => ({
        material_name: input.raw_material_batch.material_name,
        material_type: input.raw_material_batch.material_type,
        batch_number: input.raw_material_batch.batch_number,
        quantity_used: input.quantity_used,
        unit: input.unit,
        received_date: input.raw_material_batch.received_date,
        supplier: {
          name: input.raw_material_batch.supplier.name,
          country: input.raw_material_batch.supplier.country,
          certifications: input.raw_material_batch.supplier.certifications,
        },
      })),
    };
  }

  private async getProductionRunWithDetails(id: string) {
    return this.productionRunRepository.findOne({
      where: { id },
      relations: ['factory', 'inputs', 'inputs.raw_material_batch'],
    });
  }
}
