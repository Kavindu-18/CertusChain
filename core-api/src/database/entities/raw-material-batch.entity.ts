import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Supplier } from './supplier.entity';
import { ProductionRunInput } from './production-run-input.entity';

@Entity('raw_material_batches')
export class RawMaterialBatch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  supplier_id: string;

  @Column()
  material_name: string;

  @Column({ nullable: true })
  material_type: string;

  @Column()
  batch_number: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number;

  @Column({ default: 'kg' })
  unit: string;

  @Column({ type: 'date' })
  received_date: Date;

  @Column({ type: 'jsonb', nullable: true })
  certifications: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Supplier, (supplier) => supplier.raw_material_batches)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @OneToMany(() => ProductionRunInput, (input) => input.raw_material_batch)
  production_run_inputs: ProductionRunInput[];
}
