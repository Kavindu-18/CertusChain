import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ProductionRun } from './production-run.entity';

@Entity('finished_good_batches')
export class FinishedGoodBatch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  production_run_id: string;

  @Column({ unique: true })
  qr_code_id: string;

  @Column()
  product_name: string;

  @Column({ nullable: true })
  product_sku: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ default: 'pieces' })
  unit: string;

  @Column({ type: 'date' })
  production_date: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => ProductionRun, (run) => run.finished_goods)
  @JoinColumn({ name: 'production_run_id' })
  production_run: ProductionRun;
}
