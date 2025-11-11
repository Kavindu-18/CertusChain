import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('compliance_reports')
export class ComplianceReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  company_id: string;

  @Column()
  report_type: string;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date' })
  end_date: Date;

  @Column({ type: 'text' })
  report_content: string;

  @Column({ nullable: true })
  file_url: string;

  @Column({ nullable: true })
  generated_by: string;

  @CreateDateColumn()
  created_at: Date;
}
