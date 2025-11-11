import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ProductionRun } from './production-run.entity';
import { RawMaterialBatch } from './raw-material-batch.entity';

@Entity('production_run_inputs')
export class ProductionRunInput {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  production_run_id: string;

  @Column()
  raw_material_batch_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity_used: number;

  @Column({ default: 'kg' })
  unit: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => ProductionRun, (run) => run.inputs)
  @JoinColumn({ name: 'production_run_id' })
  production_run: ProductionRun;

  @ManyToOne(() => RawMaterialBatch, (batch) => batch.production_run_inputs)
  @JoinColumn({ name: 'raw_material_batch_id' })
  raw_material_batch: RawMaterialBatch;
}
