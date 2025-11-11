import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('energy_metrics')
@Index(['device_id', 'timestamp'])
export class EnergyMetric {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  device_id: string;

  @Column({ type: 'timestamptz' })
  timestamp: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  kwh: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  voltage: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  current: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  power_factor: number;
}
