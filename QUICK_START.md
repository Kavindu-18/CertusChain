# 🎯 CertusChain - Quick Start Guide

## ⚡ Fastest Way to Get Started

### Option 1: Start Frontend Only (Quick Demo)

```bash
cd /Users/kavinduperera/Desktop/CertusChain/frontend
./start.sh
```

Visit: **http://localhost:3001**

> **Note**: You'll need the backend running to use the application. See Option 2 or 3.

---

### Option 2: Start Everything with Docker (Recommended)

```bash
cd /Users/kavinduperera/Desktop/CertusChain

# 1. Configure environment (first time only)
cp core-api/.env.example core-api/.env
cp ai-service/.env.example ai-service/.env

# 2. Edit .env files - ADD YOUR OPENAI API KEY

# 3. Start all services
./start.sh
# Select: 1. Start all services

# 4. Run migrations (first time only)
# Select: 6. Run database migrations
```

**Services:**
- ✅ Frontend: http://localhost:3001
- ✅ Backend API: http://localhost:3000
- ✅ API Docs: http://localhost:3000/api
- ✅ PostgreSQL: localhost:5432
- ✅ AI Service: http://localhost:8001

---

### Option 3: Manual Development Mode

#### Terminal 1 - Backend
```bash
cd /Users/kavinduperera/Desktop/CertusChain/core-api
npm install
cp .env.example .env
# Edit .env with database settings
npm run start:dev
```

#### Terminal 2 - Frontend
```bash
cd /Users/kavinduperera/Desktop/CertusChain/frontend
npm install
npm run dev
```

#### Terminal 3 - Database
```bash
# Start PostgreSQL with Docker
docker run -d \
  --name certuschain-db \
  -e POSTGRES_DB=certuschain \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  timescale/timescaledb:latest-pg14
```

---

## 📋 First Time Setup Checklist

### 1. Environment Variables

**Backend (.env)**
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=certuschain
JWT_SECRET=your-super-secret-jwt-key-change-this
AI_SERVICE_URL=http://localhost:8001
```

**AI Service (.env)**
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/certuschain
OPENAI_API_KEY=sk-your-openai-api-key-here
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 2. Install Dependencies

```bash
# Backend
cd core-api && npm install

# Frontend
cd ../frontend && npm install
```

### 3. Database Setup

**Option A - With Docker:**
```bash
./start.sh
# Select: 6. Run database migrations
```

**Option B - Manual:**
```bash
cd core-api
npm run migration:run
```

---

## 🎓 Your First Steps in the App

### 1. Register Your Company
1. Go to http://localhost:3001
2. Click "Register"
3. Fill in company details
4. Your account is created as **Admin**

### 2. Add a Factory
1. Navigate to **Factories**
2. Click "Add Factory"
3. Fill in factory details
4. Save

### 3. Add a Supplier
1. Navigate to **Suppliers**
2. Click "Add Supplier"
3. Include certifications (GOTS, OEKO-TEX, etc.)
4. Save

### 4. Register IoT Device
1. Navigate to **IoT Devices**
2. Click "Register Device"
3. Select factory and device type
4. Save

### 5. Track a Product (via API)

**Step 1: Register Raw Material**
```bash
curl -X POST http://localhost:3000/trace/raw-material \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "supplier_id": "your-supplier-id",
    "material_name": "Organic Cotton",
    "material_type": "Fabric",
    "batch_number": "BATCH-2024-001",
    "quantity": 500,
    "unit": "kg",
    "received_date": "2024-01-15"
  }'
```

**Step 2: Create Production Run**
```bash
curl -X POST http://localhost:3000/trace/production-run \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "factory_id": "your-factory-id",
    "run_number": "RUN-2024-001",
    "product_type": "T-Shirt",
    "start_date": "2024-01-15",
    "end_date": "2024-01-20",
    "units_produced": 1000,
    "raw_material_inputs": [{
      "raw_material_batch_id": "your-material-id",
      "quantity_used": 250,
      "unit": "kg"
    }]
  }'
```

**Step 3: Create Finished Good (Get QR Code)**
```bash
curl -X POST http://localhost:3000/trace/finished-good \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "production_run_id": "your-run-id",
    "product_name": "Eco T-Shirt",
    "product_sku": "SKU-001",
    "quantity": 500,
    "unit": "pieces",
    "production_date": "2024-01-20"
  }'
```

**Step 4: Lookup Product (Public - No Auth)**
```bash
curl http://localhost:3000/trace/CC-Ab3xY9Zk7Mn2
```

### 6. Generate ESG Report
1. Navigate to **Reports**
2. Click "Generate Report"
3. Select report type (GRI or CSDDD)
4. Choose date range
5. Click "Generate"
6. Wait for AI to create report
7. Download as Markdown

---

## 🔍 Testing the API

### Using Swagger UI (Recommended)
1. Visit http://localhost:3000/api
2. Click "Authorize" button
3. Enter: `Bearer YOUR_TOKEN`
4. Try out any endpoint interactively

### Using Postman
1. Import endpoints from Swagger JSON
2. Set Authorization header: `Bearer YOUR_TOKEN`
3. Test endpoints

### Using cURL
See examples in `API_TESTING_GUIDE.md`

---

## 🐛 Common Issues & Solutions

### "Cannot connect to database"
**Solution**: Make sure PostgreSQL is running
```bash
docker ps  # Check if database container is running
./start.sh  # Select option 5: Check services status
```

### "401 Unauthorized"
**Solution**: Token expired or invalid
1. Login again to get new token
2. Check Authorization header format: `Bearer <token>`

### "Port 3000 already in use"
**Solution**: Another service is using the port
```bash
# Find process using port 3000
lsof -ti:3000
# Kill it
kill -9 $(lsof -ti:3000)
```

### Frontend won't start
**Solution**: Clear and reinstall
```bash
cd frontend
rm -rf node_modules .next
npm install
npm run dev
```

### Python dependencies fail
**Solution**: Use Docker instead
```bash
# Your Python 3.14 is too new for numpy
# Docker uses Python 3.11 which works perfectly
./start.sh
# Select option 1
```

---

## 📊 Monitoring & Logs

### View Logs with Docker
```bash
./start.sh
# Select: 3. View service logs
```

### Or manually:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f core-api
docker-compose logs -f frontend
docker-compose logs -f ai-service
```

### Backend Logs (Manual)
```bash
cd core-api
npm run start:dev
# Logs appear in terminal
```

---

## 🎯 Production Deployment

### Frontend → Vercel
```bash
cd frontend
vercel login
vercel deploy --prod
```

Set environment variable on Vercel:
- `NEXT_PUBLIC_API_URL=https://your-api.com`

### Backend → Docker Hub → Cloud
```bash
# Build and push
cd core-api
docker build -t certuschain-api:latest .
docker tag certuschain-api:latest yourusername/certuschain-api:latest
docker push yourusername/certuschain-api:latest

# Deploy to AWS/GCP/Azure
# Use docker-compose.yml or Kubernetes manifests
```

### Database → Managed Service
- AWS RDS (PostgreSQL)
- Google Cloud SQL
- Azure Database
- TimescaleDB Cloud
- Supabase

Update `.env` with production database URL

---

## 💡 Pro Tips

### 1. API Documentation is Interactive
- Visit http://localhost:3000/api
- Test endpoints directly in browser
- No Postman needed!

### 2. QR Lookup is Public
- No authentication required
- Share QR codes with customers
- Full supply chain transparency

### 3. Multi-Tenant by Design
- Each company sees only their data
- company_id automatically filtered
- Perfect for SaaS deployment

### 4. Roles Matter
- **ADMIN**: Full access, user management
- **FACTORY_MANAGER**: Operations only
- **VIEWER**: Read-only access

### 5. ESG Reports Use Real AI
- Requires OpenAI API key
- Uses GPT-4 for narratives
- Calculates real metrics from IoT data

---

## 📚 Documentation

- **README.md** - Project overview
- **GETTING_STARTED.md** - Detailed setup
- **API_TESTING_GUIDE.md** - Complete API reference
- **PROJECT_SUMMARY.md** - Architecture details
- **FULL_PROJECT_COMPLETE.md** - This document
- **frontend/README.md** - Frontend specific docs

---

## ✅ Quick Verification

After starting services, verify everything works:

1. **Backend Health**: http://localhost:3000/
2. **API Docs**: http://localhost:3000/api
3. **Frontend**: http://localhost:3001
4. **Database**: `psql -h localhost -U postgres -d certuschain`

---

## 🚀 You're Ready!

Your CertusChain platform is:
- ✅ Fully built
- ✅ Fully tested
- ✅ Production ready
- ✅ Documented
- ✅ Deployable

**Start building the future of sustainable supply chains! 🌱**

---

## 📞 Quick Reference

```bash
# Start everything
./start.sh → Option 1

# Run migrations
./start.sh → Option 6

# View logs
./start.sh → Option 3

# Stop everything
./start.sh → Option 2

# Frontend only
cd frontend && ./start.sh

# Backend only
cd core-api && npm run start:dev
```

---

**Happy Building! 🎉**
