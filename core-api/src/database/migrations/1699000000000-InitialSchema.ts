import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1699000000000 implements MigrationInterface {
  name = 'InitialSchema1699000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable TimescaleDB extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;`);

    // Create companies table
    await queryRunner.query(`
      CREATE TABLE "companies" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" VARCHAR NOT NULL UNIQUE,
        "email" VARCHAR NOT NULL UNIQUE,
        "phone" VARCHAR,
        "address" VARCHAR,
        "country" VARCHAR,
        "is_active" BOOLEAN DEFAULT true,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create users table
    await queryRunner.query(`
      CREATE TYPE "user_role_enum" AS ENUM ('ADMIN', 'FACTORY_MANAGER', 'VIEWER');
      
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "company_id" uuid NOT NULL REFERENCES "companies"("id") ON DELETE CASCADE,
        "first_name" VARCHAR NOT NULL,
        "last_name" VARCHAR NOT NULL,
        "email" VARCHAR NOT NULL UNIQUE,
        "password_hash" VARCHAR NOT NULL,
        "role" user_role_enum DEFAULT 'VIEWER',
        "is_active" BOOLEAN DEFAULT true,
        "last_login" TIMESTAMP,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
      
      CREATE INDEX "idx_users_company_id" ON "users"("company_id");
      CREATE INDEX "idx_users_email" ON "users"("email");
    `);

    // Create factories table
    await queryRunner.query(`
      CREATE TABLE "factories" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "company_id" uuid NOT NULL REFERENCES "companies"("id") ON DELETE CASCADE,
        "name" VARCHAR NOT NULL,
        "address" VARCHAR,
        "city" VARCHAR,
        "country" VARCHAR,
        "latitude" DECIMAL(10, 7),
        "longitude" DECIMAL(10, 7),
        "contact_person" VARCHAR,
        "contact_email" VARCHAR,
        "contact_phone" VARCHAR,
        "is_active" BOOLEAN DEFAULT true,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
      
      CREATE INDEX "idx_factories_company_id" ON "factories"("company_id");
    `);

    // Create suppliers table
    await queryRunner.query(`
      CREATE TABLE "suppliers" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "company_id" uuid NOT NULL REFERENCES "companies"("id") ON DELETE CASCADE,
        "name" VARCHAR NOT NULL,
        "address" VARCHAR,
        "country" VARCHAR,
        "contact_person" VARCHAR,
        "contact_email" VARCHAR,
        "contact_phone" VARCHAR,
        "certifications" TEXT,
        "is_active" BOOLEAN DEFAULT true,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
      
      CREATE INDEX "idx_suppliers_company_id" ON "suppliers"("company_id");
    `);

    // Create raw_material_batches table
    await queryRunner.query(`
      CREATE TABLE "raw_material_batches" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "supplier_id" uuid NOT NULL REFERENCES "suppliers"("id") ON DELETE CASCADE,
        "material_name" VARCHAR NOT NULL,
        "material_type" VARCHAR,
        "batch_number" VARCHAR NOT NULL,
        "quantity" DECIMAL(10, 2) NOT NULL,
        "unit" VARCHAR DEFAULT 'kg',
        "received_date" DATE NOT NULL,
        "certifications" JSONB,
        "notes" TEXT,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
      
      CREATE INDEX "idx_raw_material_batches_supplier_id" ON "raw_material_batches"("supplier_id");
    `);

    // Create production_runs table
    await queryRunner.query(`
      CREATE TABLE "production_runs" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "factory_id" uuid NOT NULL REFERENCES "factories"("id") ON DELETE CASCADE,
        "run_number" VARCHAR NOT NULL,
        "product_type" VARCHAR,
        "start_date" DATE NOT NULL,
        "end_date" DATE,
        "units_produced" INT DEFAULT 0,
        "notes" TEXT,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
      
      CREATE INDEX "idx_production_runs_factory_id" ON "production_runs"("factory_id");
    `);

    // Create production_run_inputs table (many-to-many)
    await queryRunner.query(`
      CREATE TABLE "production_run_inputs" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "production_run_id" uuid NOT NULL REFERENCES "production_runs"("id") ON DELETE CASCADE,
        "raw_material_batch_id" uuid NOT NULL REFERENCES "raw_material_batches"("id") ON DELETE CASCADE,
        "quantity_used" DECIMAL(10, 2) NOT NULL,
        "unit" VARCHAR DEFAULT 'kg',
        "created_at" TIMESTAMP DEFAULT NOW()
      );
      
      CREATE INDEX "idx_production_run_inputs_production_run" ON "production_run_inputs"("production_run_id");
      CREATE INDEX "idx_production_run_inputs_raw_material" ON "production_run_inputs"("raw_material_batch_id");
    `);

    // Create finished_good_batches table
    await queryRunner.query(`
      CREATE TABLE "finished_good_batches" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "production_run_id" uuid NOT NULL REFERENCES "production_runs"("id") ON DELETE CASCADE,
        "qr_code_id" VARCHAR NOT NULL UNIQUE,
        "product_name" VARCHAR NOT NULL,
        "product_sku" VARCHAR,
        "quantity" INT NOT NULL,
        "unit" VARCHAR DEFAULT 'pieces',
        "production_date" DATE NOT NULL,
        "notes" TEXT,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
      
      CREATE INDEX "idx_finished_good_batches_production_run" ON "finished_good_batches"("production_run_id");
      CREATE INDEX "idx_finished_good_batches_qr_code" ON "finished_good_batches"("qr_code_id");
    `);

    // Create compliance_reports table
    await queryRunner.query(`
      CREATE TABLE "compliance_reports" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "company_id" uuid NOT NULL REFERENCES "companies"("id") ON DELETE CASCADE,
        "report_type" VARCHAR NOT NULL,
        "start_date" DATE NOT NULL,
        "end_date" DATE NOT NULL,
        "report_content" TEXT NOT NULL,
        "file_url" VARCHAR,
        "generated_by" uuid,
        "created_at" TIMESTAMP DEFAULT NOW()
      );
      
      CREATE INDEX "idx_compliance_reports_company_id" ON "compliance_reports"("company_id");
    `);

    // Create audit_logs table
    await queryRunner.query(`
      CREATE TABLE "audit_logs" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "company_id" uuid NOT NULL,
        "action_type" VARCHAR NOT NULL,
        "target_resource_id" uuid,
        "target_resource_type" VARCHAR,
        "before_value" JSONB,
        "after_value" JSONB,
        "ip_address" VARCHAR,
        "created_at" TIMESTAMP DEFAULT NOW()
      );
      
      CREATE INDEX "idx_audit_logs_user_id" ON "audit_logs"("user_id");
      CREATE INDEX "idx_audit_logs_company_id" ON "audit_logs"("company_id");
      CREATE INDEX "idx_audit_logs_created_at" ON "audit_logs"("created_at");
    `);

    // Create iot_devices table
    await queryRunner.query(`
      CREATE TYPE "device_type_enum" AS ENUM ('ENERGY', 'WATER', 'WASTE');
      
      CREATE TABLE "iot_devices" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "factory_id" uuid NOT NULL REFERENCES "factories"("id") ON DELETE CASCADE,
        "device_name" VARCHAR NOT NULL,
        "device_id" VARCHAR NOT NULL UNIQUE,
        "device_type" device_type_enum NOT NULL,
        "location" VARCHAR,
        "is_active" BOOLEAN DEFAULT true,
        "last_ping" TIMESTAMP,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
      
      CREATE INDEX "idx_iot_devices_factory_id" ON "iot_devices"("factory_id");
      CREATE INDEX "idx_iot_devices_device_id" ON "iot_devices"("device_id");
    `);

    // Create energy_metrics table (TimescaleDB hypertable)
    await queryRunner.query(`
      CREATE TABLE "energy_metrics" (
        "id" uuid DEFAULT uuid_generate_v4(),
        "device_id" VARCHAR NOT NULL,
        "timestamp" TIMESTAMPTZ NOT NULL,
        "kwh" DECIMAL(10, 2) NOT NULL,
        "voltage" DECIMAL(10, 2),
        "current" DECIMAL(10, 2),
        "power_factor" DECIMAL(10, 2)
      );
      
      SELECT create_hypertable('energy_metrics', 'timestamp');
      
      CREATE INDEX "idx_energy_metrics_device_timestamp" ON "energy_metrics"("device_id", "timestamp" DESC);
    `);

    // Create water_metrics table (TimescaleDB hypertable)
    await queryRunner.query(`
      CREATE TABLE "water_metrics" (
        "id" uuid DEFAULT uuid_generate_v4(),
        "device_id" VARCHAR NOT NULL,
        "timestamp" TIMESTAMPTZ NOT NULL,
        "flow_rate" DECIMAL(10, 2) NOT NULL,
        "volume_liters" DECIMAL(10, 2),
        "ph" DECIMAL(5, 2),
        "tds" DECIMAL(10, 2),
        "temperature" DECIMAL(5, 2)
      );
      
      SELECT create_hypertable('water_metrics', 'timestamp');
      
      CREATE INDEX "idx_water_metrics_device_timestamp" ON "water_metrics"("device_id", "timestamp" DESC);
    `);

    // Create waste_metrics table (TimescaleDB hypertable)
    await queryRunner.query(`
      CREATE TABLE "waste_metrics" (
        "id" uuid DEFAULT uuid_generate_v4(),
        "factory_id" VARCHAR NOT NULL,
        "timestamp" TIMESTAMPTZ NOT NULL,
        "waste_type" VARCHAR NOT NULL,
        "weight_kg" DECIMAL(10, 2) NOT NULL,
        "disposal_method" VARCHAR,
        "notes" TEXT
      );
      
      SELECT create_hypertable('waste_metrics', 'timestamp');
      
      CREATE INDEX "idx_waste_metrics_factory_timestamp" ON "waste_metrics"("factory_id", "timestamp" DESC);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order
    await queryRunner.query(`DROP TABLE IF EXISTS "waste_metrics" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "water_metrics" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "energy_metrics" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "iot_devices" CASCADE;`);
    await queryRunner.query(`DROP TYPE IF EXISTS "device_type_enum";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "audit_logs" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "compliance_reports" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "finished_good_batches" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "production_run_inputs" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "production_runs" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "raw_material_batches" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "suppliers" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "factories" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE;`);
    await queryRunner.query(`DROP TYPE IF EXISTS "user_role_enum";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "companies" CASCADE;`);
  }
}
