import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnergyMetric } from '@/database/entities/energy-metric.entity';
import { WaterMetric } from '@/database/entities/water-metric.entity';
import { WasteMetric } from '@/database/entities/waste-metric.entity';
import { IoTDevice, DeviceType } from '@/database/entities/iot-device.entity';
import { IoTDataDto } from './dto';

@Injectable()
export class IngestService {
  constructor(
    @InjectRepository(EnergyMetric)
    private readonly energyRepository: Repository<EnergyMetric>,
    @InjectRepository(WaterMetric)
    private readonly waterRepository: Repository<WaterMetric>,
    @InjectRepository(WasteMetric)
    private readonly wasteRepository: Repository<WasteMetric>,
    @InjectRepository(IoTDevice)
    private readonly deviceRepository: Repository<IoTDevice>,
  ) {}

  async ingestIoTData(companyId: string, dataArray: IoTDataDto[]) {
    if (!dataArray || dataArray.length === 0) {
      throw new BadRequestException('No data provided');
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [],
    };

    // Process in batches for better performance
    const energyData = [];
    const waterData = [];
    const wasteData = [];

    for (const data of dataArray) {
      try {
        // Verify device exists and belongs to company's factory
        const device = await this.deviceRepository
          .createQueryBuilder('device')
          .innerJoin('device.factory', 'factory')
          .where('device.device_id = :deviceId', { deviceId: data.device_id })
          .andWhere('factory.company_id = :companyId', { companyId })
          .getOne();

        if (!device) {
          results.failed++;
          results.errors.push(`Device ${data.device_id} not found`);
          continue;
        }

        // Route to appropriate table based on device type
        switch (device.device_type) {
          case DeviceType.ENERGY:
            energyData.push(
              this.energyRepository.create({
                device_id: data.device_id,
                timestamp: new Date(data.timestamp),
                kwh: data.kwh,
                voltage: data.voltage,
                current: data.current,
                power_factor: data.power_factor,
              }),
            );
            break;

          case DeviceType.WATER:
            waterData.push(
              this.waterRepository.create({
                device_id: data.device_id,
                timestamp: new Date(data.timestamp),
                flow_rate: data.flow_rate,
                volume_liters: data.volume_liters,
                ph: data.ph,
                tds: data.tds,
                temperature: data.temperature,
              }),
            );
            break;

          case DeviceType.WASTE:
            wasteData.push(
              this.wasteRepository.create({
                factory_id: device.factory_id,
                timestamp: new Date(data.timestamp),
                waste_type: data.waste_type,
                weight_kg: data.weight_kg,
                disposal_method: data.disposal_method,
                notes: data.notes,
              }),
            );
            break;
        }

        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(`Error processing ${data.device_id}: ${error.message}`);
      }
    }

    // Batch insert into respective tables
    if (energyData.length > 0) {
      await this.energyRepository.save(energyData);
    }
    if (waterData.length > 0) {
      await this.waterRepository.save(waterData);
    }
    if (wasteData.length > 0) {
      await this.wasteRepository.save(wasteData);
    }

    return results;
  }
}
