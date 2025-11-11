import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Factory } from './factory.entity';

export enum DeviceType {
  ENERGY = 'ENERGY',
  WATER = 'WATER',
  WASTE = 'WASTE',
}

@Entity('iot_devices')
export class IoTDevice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  factory_id: string;

  @Column()
  device_name: string;

  @Column({ unique: true })
  device_id: string;

  @Column({
    type: 'enum',
    enum: DeviceType,
  })
  device_type: DeviceType;

  @Column({ nullable: true })
  location: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ nullable: true })
  last_ping: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Factory, (factory) => factory.devices)
  @JoinColumn({ name: 'factory_id' })
  factory: Factory;
}
