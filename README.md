# CertusChain - ESG & Supply Chain Traceability Platform

## Overview
CertusChain is a B2B SaaS platform for Sri Lankan apparel manufacturers providing compliance-in-a-box through:
- Supply chain traceability (raw materials → finished goods)
- Automated ESG compliance report generation (CSDDD/GRI standards)
- Real-time factory data ingestion and analysis

## Architecture
Microservices architecture with two services:
1. **Core SaaS API (NestJS)** - User-facing logic, authentication, data management
2. **AI/ML Microservice (FastAPI)** - Generative AI reporting and ML anomaly detection

## Technology Stack
- **Core API**: NestJS (TypeScript)
- **AI/ML API**: Python 3.10+ with FastAPI
- **Database**: PostgreSQL 14+ with TimescaleDB extension
- **Authentication**: JWT-based

## Prerequisites
- Node.js 18+
- Python 3.10+
- Docker & Docker Compose
- PostgreSQL 14+ with TimescaleDB extension

## Quick Start

### Using Docker Compose (Recommended)
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Setup

#### 1. Database Setup
```bash
# Start PostgreSQL with TimescaleDB
docker run -d --name certuschain-db \
  -e POSTGRES_DB=certuschain \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  timescale/timescaledb:latest-pg14
```

#### 2. Core API (NestJS)
```bash
cd core-api
npm install
npm run migration:run
npm run start:dev
```

#### 3. AI/ML Service (FastAPI)
```bash
cd ai-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

## Service Endpoints

### Core API (Port 3000)
- **Auth**: `/auth/register`, `/auth/login`
- **Entities**: `/factories`, `/suppliers`, `/users`, `/devices`
- **Traceability**: `/trace/*`
- **IoT Ingestion**: `/ingest/iot`
- **Reports**: `/reports/*`

### AI/ML Service (Port 8001)
- **Internal APIs**: `/ai/generate-report`, `/ai/detect-anomalies`

## Environment Variables

### Core API (.env)
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/certuschain
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRATION=7d
AI_SERVICE_URL=http://localhost:8001
PORT=3000
```

### AI/ML Service (.env)
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/certuschain
OPENAI_API_KEY=your-openai-api-key
PORT=8001
```

## Database Schema

### Relational Tables
- `companies` - Tenant accounts
- `users` - User management
- `roles` - Role-based permissions
- `factories` - Factory locations
- `suppliers` - Raw material suppliers
- `raw_material_batches` - Incoming materials
- `production_runs` - Manufacturing events
- `production_run_inputs` - Many-to-many join table
- `finished_good_batches` - Final products with QR codes
- `compliance_reports` - Generated ESG reports
- `audit_logs` - Immutable action logs

### TimescaleDB Hypertables
- `iot_devices` - Sensor device registry
- `energy_metrics` - Energy consumption data
- `water_metrics` - Water usage data
- `waste_metrics` - Daily waste output

## Development

### Run Tests
```bash
# Core API
cd core-api
npm run test

# AI Service
cd ai-service
pytest
```

### Database Migrations
```bash
cd core-api
npm run migration:generate -- -n MigrationName
npm run migration:run
```

## License
Proprietary - All rights reserved
