# CertusChain - Getting Started Guide

## 🚀 Quick Start

### Prerequisites
Before you begin, ensure you have installed:
- **Node.js** 18+ 
- **Python** 3.11+
- **Docker & Docker Compose** (recommended)
- **PostgreSQL** 14+ with TimescaleDB extension
- **OpenAI API Key** (for AI report generation)

---

## Option 1: Docker Compose (Recommended)

The fastest way to get CertusChain running:

```bash
# 1. Clone or navigate to the project
cd /Users/kavinduperera/Desktop/CertusChain

# 2. Set up environment variables
cp core-api/.env.example core-api/.env
cp ai-service/.env.example ai-service/.env

# Edit the .env files with your OpenAI API key

# 3. Start all services
docker-compose up -d

# 4. View logs
docker-compose logs -f

# 5. Run database migrations
docker-compose exec core-api npm run migration:run
```

**Services will be available at:**
- Core API: http://localhost:3000
- API Documentation: http://localhost:3000/api
- AI Service: http://localhost:8001
- Database: localhost:5432

---

## Option 2: Manual Setup

### Step 1: Database Setup

```bash
# Start PostgreSQL with TimescaleDB
docker run -d --name certuschain-db \
  -e POSTGRES_DB=certuschain \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  timescale/timescaledb:latest-pg14
```

### Step 2: Core API (NestJS)

```bash
cd core-api

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your database URL and JWT secret

# Run migrations
npm run migration:run

# Start development server
npm run start:dev
```

The API will be available at http://localhost:3000

### Step 3: AI/ML Service (Python/FastAPI)

```bash
cd ai-service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env with your database URL and OpenAI API key

# Start development server
uvicorn main:app --reload --port 8001
```

The AI service will be available at http://localhost:8001

---

## 📝 First Steps

### 1. Register a Company and Admin User

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Green Apparel Ltd",
    "company_email": "info@greenapparel.lk",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@greenapparel.lk",
    "password": "SecurePass123!"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "john@greenapparel.lk",
    "role": "ADMIN"
  },
  "company": {
    "id": "uuid",
    "name": "Green Apparel Ltd"
  }
}
```

Save the `access_token` for subsequent requests!

### 2. Create a Factory

```bash
curl -X POST http://localhost:3000/factories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Factory 1 - Colombo",
    "address": "123 Main Street",
    "city": "Colombo",
    "country": "Sri Lanka",
    "latitude": 6.9271,
    "longitude": 79.8612
  }'
```

### 3. Register IoT Devices

```bash
curl -X POST http://localhost:3000/devices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "factory_id": "FACTORY_UUID",
    "device_name": "Energy Meter 1",
    "device_id": "DEVICE-ENERGY-001",
    "device_type": "ENERGY",
    "location": "Production Floor A"
  }'
```

### 4. Ingest IoT Data

```bash
curl -X POST http://localhost:3000/ingest/iot \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '[
    {
      "device_id": "DEVICE-ENERGY-001",
      "timestamp": "2024-01-15T10:30:00Z",
      "kwh": 5.2,
      "voltage": 230,
      "current": 10.5
    },
    {
      "device_id": "DEVICE-WATER-001",
      "timestamp": "2024-01-15T10:30:00Z",
      "flow_rate": 150.5,
      "volume_liters": 1000,
      "ph": 7.2
    }
  ]'
```

### 5. Create Supply Chain Traceability

#### 5.1 Create Supplier
```bash
curl -X POST http://localhost:3000/suppliers \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Eco Cotton Suppliers",
    "country": "India",
    "certifications": "GOTS, OEKO-TEX"
  }'
```

#### 5.2 Add Raw Material Batch
```bash
curl -X POST http://localhost:3000/trace/raw-material \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "supplier_id": "SUPPLIER_UUID",
    "material_name": "Organic Cotton",
    "material_type": "Fabric",
    "batch_number": "BATCH-2024-001",
    "quantity": 500,
    "unit": "kg",
    "received_date": "2024-01-15"
  }'
```

#### 5.3 Create Production Run
```bash
curl -X POST http://localhost:3000/trace/production-run \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "factory_id": "FACTORY_UUID",
    "run_number": "RUN-2024-001",
    "product_type": "T-Shirt",
    "start_date": "2024-01-15",
    "end_date": "2024-01-20",
    "units_produced": 1000,
    "raw_material_inputs": [
      {
        "raw_material_batch_id": "RAW_MATERIAL_UUID",
        "quantity_used": 250,
        "unit": "kg"
      }
    ]
  }'
```

#### 5.4 Create Finished Good with QR Code
```bash
curl -X POST http://localhost:3000/trace/finished-good \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "production_run_id": "PRODUCTION_RUN_UUID",
    "product_name": "Eco-Friendly T-Shirt",
    "product_sku": "SKU-12345",
    "quantity": 500,
    "unit": "pieces",
    "production_date": "2024-01-20"
  }'
```

**Response includes auto-generated QR code:**
```json
{
  "id": "uuid",
  "qr_code_id": "CC-Ab3xY9Zk7Mn2",
  "product_name": "Eco-Friendly T-Shirt",
  ...
}
```

### 6. Lookup Product Traceability (Public - No Auth!)

```bash
curl http://localhost:3000/trace/CC-Ab3xY9Zk7Mn2
```

Returns full supply chain traceability from raw materials to finished product!

### 7. Generate ESG Compliance Report

```bash
curl -X POST http://localhost:3000/reports/generate \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "report_type": "GRI",
    "start_date": "2024-01-01",
    "end_date": "2024-12-31"
  }'
```

This will:
1. Aggregate all IoT data from TimescaleDB
2. Calculate ESG metrics
3. Use AI (OpenAI GPT-4) to generate comprehensive compliance report
4. Return report with metrics

---

## 🔍 API Documentation

Once services are running, access interactive API documentation:

**Swagger UI:** http://localhost:3000/api

---

## 🧪 Testing

### Core API Tests
```bash
cd core-api
npm run test
npm run test:e2e
```

### AI Service Tests
```bash
cd ai-service
pytest
pytest --cov=.
```

---

## 📊 Database Access

```bash
# Connect to database
docker exec -it certuschain-db psql -U postgres -d certuschain

# View tables
\dt

# View hypertables
SELECT * FROM timescaledb_information.hypertables;

# Query energy metrics
SELECT * FROM energy_metrics LIMIT 10;
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Find and kill process on port 8001
lsof -ti:8001 | xargs kill -9
```

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps | grep certuschain-db

# Restart database
docker restart certuschain-db

# View database logs
docker logs certuschain-db
```

### Migration Errors
```bash
# Revert last migration
cd core-api
npm run migration:revert

# Run migrations again
npm run migration:run
```

### OpenAI API Errors
- Verify your API key in `ai-service/.env`
- Check OpenAI quota and billing
- Service falls back to template reports if AI fails

---

## 📚 Next Steps

1. **Explore API Documentation**: http://localhost:3000/api
2. **Set up continuous IoT data ingestion**
3. **Configure production environment variables**
4. **Set up monitoring and logging**
5. **Deploy to production** (see deployment docs)

---

## 🆘 Support

- **Documentation**: See individual service READMEs
- **Issues**: Check logs for error messages
- **Database**: Review migration files in `core-api/src/database/migrations`

---

**🎉 Congratulations! CertusChain is now running!**
