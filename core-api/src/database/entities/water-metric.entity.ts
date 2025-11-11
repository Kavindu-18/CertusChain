import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('water_metrics')
@Index(['device_id', 'timestamp'])
export class WaterMetric {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  device_id: string;

  @Column({ type: 'timestamptz' })
  timestamp: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  flow_rate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  volume_liters: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  ph: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  tds: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  temperature: number;
}
