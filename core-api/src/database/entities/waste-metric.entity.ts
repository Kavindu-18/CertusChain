import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('waste_metrics')
@Index(['factory_id', 'timestamp'])
export class WasteMetric {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  factory_id: string;

  @Column({ type: 'timestamptz' })
  timestamp: Date;

  @Column()
  waste_type: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  weight_kg: number;

  @Column({ nullable: true })
  disposal_method: string;

  @Column({ type: 'text', nullable: true })
  notes: string;
}
