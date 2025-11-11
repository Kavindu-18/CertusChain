import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  company_id: string;

  @Column()
  action_type: string;

  @Column({ nullable: true })
  target_resource_id: string;

  @Column({ nullable: true })
  target_resource_type: string;

  @Column({ type: 'jsonb', nullable: true })
  before_value: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  after_value: Record<string, any>;

  @Column({ nullable: true })
  ip_address: string;

  @CreateDateColumn()
  created_at: Date;
}
