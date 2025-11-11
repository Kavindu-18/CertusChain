import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Factory } from './factory.entity';
import { ProductionRunInput } from './production-run-input.entity';
import { FinishedGoodBatch } from './finished-good-batch.entity';

@Entity('production_runs')
export class ProductionRun {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  factory_id: string;

  @Column()
  run_number: string;

  @Column({ nullable: true })
  product_type: string;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date;

  @Column({ type: 'int', default: 0 })
  units_produced: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Factory, (factory) => factory.production_runs)
  @JoinColumn({ name: 'factory_id' })
  factory: Factory;

  @OneToMany(() => ProductionRunInput, (input) => input.production_run)
  inputs: ProductionRunInput[];

  @OneToMany(() => FinishedGoodBatch, (batch) => batch.production_run)
  finished_goods: FinishedGoodBatch[];
}
