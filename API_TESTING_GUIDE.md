# CertusChain API Testing Guide

This guide provides example API requests for testing all endpoints.

## Base URLs
- **Core API**: `http://localhost:3000`
- **AI Service**: `http://localhost:8001` (internal only)

---

## 🔐 Authentication

### 1. Register Company & Admin User

**Endpoint:** `POST /auth/register`

```json
{
  "company_name": "Green Apparel Ltd",
  "company_email": "info@greenapparel.lk",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@greenapparel.lk",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@greenapparel.lk",
    "first_name": "John",
    "last_name": "Doe",
    "role": "ADMIN",
    "company_id": "660e8400-e29b-41d4-a716-446655440000"
  },
  "company": {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "name": "Green Apparel Ltd",
    "email": "info@greenapparel.lk"
  }
}
```

**Save the `access_token` for subsequent requests!**

### 2. Login

**Endpoint:** `POST /auth/login`

```json
{
  "email": "john@greenapparel.lk",
  "password": "SecurePass123!"
}
```

---

## 🏭 Factory Management

**Headers Required:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

### Create Factory

**Endpoint:** `POST /factories`

```json
{
  "name": "Factory 1 - Colombo",
  "address": "123 Main Street, Colombo",
  "city": "Colombo",
  "country": "Sri Lanka",
  "latitude": 6.9271,
  "longitude": 79.8612,
  "contact_person": "Jane Manager",
  "contact_email": "jane@factory1.lk",
  "contact_phone": "+94771234567"
}
```

### Get All Factories

**Endpoint:** `GET /factories`

### Get Specific Factory

**Endpoint:** `GET /factories/{factory_id}`

### Update Factory

**Endpoint:** `PUT /factories/{factory_id}`

```json
{
  "name": "Factory 1 - Colombo (Updated)",
  "contact_phone": "+94771234999"
}
```

### Delete Factory

**Endpoint:** `DELETE /factories/{factory_id}`

---

## 🚚 Supplier Management

### Create Supplier

**Endpoint:** `POST /suppliers`

```json
{
  "name": "Eco Cotton Suppliers",
  "address": "456 Supplier Road",
  "country": "India",
  "contact_person": "Raj Kumar",
  "contact_email": "raj@ecocotton.in",
  "contact_phone": "+91-9876543210",
  "certifications": "GOTS, OEKO-TEX, Fair Trade"
}
```

### Get All Suppliers

**Endpoint:** `GET /suppliers`

---

## 👥 User Management (Admin Only)

### Create User

**Endpoint:** `POST /users`

```json
{
  "first_name": "Sarah",
  "last_name": "Manager",
  "email": "sarah@greenapparel.lk",
  "password": "SecurePass456!",
  "role": "FACTORY_MANAGER"
}
```

**Roles:**
- `ADMIN` - Full access
- `FACTORY_MANAGER` - Factory operations
- `VIEWER` - Read-only access

### Get All Users

**Endpoint:** `GET /users`

---

## 📡 IoT Device Management

### Register Device

**Endpoint:** `POST /devices`

```json
{
  "factory_id": "your-factory-uuid",
  "device_name": "Energy Meter 1",
  "device_id": "DEVICE-ENERGY-001",
  "device_type": "ENERGY",
  "location": "Production Floor A"
}
```

**Device Types:**
- `ENERGY` - Energy consumption meters
- `WATER` - Water flow meters
- `WASTE` - Waste tracking devices

### Get All Devices

**Endpoint:** `GET /devices`

---

## 🔗 Supply Chain Traceability

### Step 1: Create Raw Material Batch

**Endpoint:** `POST /trace/raw-material`

```json
{
  "supplier_id": "your-supplier-uuid",
  "material_name": "Organic Cotton",
  "material_type": "Fabric",
  "batch_number": "BATCH-2024-001",
  "quantity": 500,
  "unit": "kg",
  "received_date": "2024-01-15",
  "certifications": {
    "GOTS": "GOTS-2024-001",
    "OEKO-TEX": "OK-2024-001"
  },
  "notes": "Premium quality organic cotton"
}
```

### Step 2: Create Production Run

**Endpoint:** `POST /trace/production-run`

```json
{
  "factory_id": "your-factory-uuid",
  "run_number": "RUN-2024-001",
  "product_type": "T-Shirt",
  "start_date": "2024-01-15",
  "end_date": "2024-01-20",
  "units_produced": 1000,
  "notes": "Eco-friendly production run",
  "raw_material_inputs": [
    {
      "raw_material_batch_id": "your-raw-material-uuid",
      "quantity_used": 250,
      "unit": "kg"
    }
  ]
}
```

### Step 3: Create Finished Good with QR Code

**Endpoint:** `POST /trace/finished-good`

```json
{
  "production_run_id": "your-production-run-uuid",
  "product_name": "Eco-Friendly T-Shirt",
  "product_sku": "SKU-TSHIRT-001",
  "quantity": 500,
  "unit": "pieces",
  "production_date": "2024-01-20",
  "notes": "100% organic cotton, eco-friendly dyes"
}
```

**Response includes auto-generated QR code:**
```json
{
  "id": "finished-good-uuid",
  "qr_code_id": "CC-Ab3xY9Zk7Mn2",
  "product_name": "Eco-Friendly T-Shirt",
  "production_date": "2024-01-20",
  ...
}
```

### Step 4: Public QR Code Lookup (No Auth!)

**Endpoint:** `GET /trace/CC-Ab3xY9Zk7Mn2`

**No Authorization header needed!**

**Response:**
```json
{
  "finished_good": {
    "qr_code_id": "CC-Ab3xY9Zk7Mn2",
    "product_name": "Eco-Friendly T-Shirt",
    "quantity": 500,
    "production_date": "2024-01-20"
  },
  "production_run": {
    "run_number": "RUN-2024-001",
    "product_type": "T-Shirt",
    "start_date": "2024-01-15",
    "factory": {
      "name": "Factory 1 - Colombo",
      "city": "Colombo",
      "country": "Sri Lanka"
    }
  },
  "raw_materials": [
    {
      "material_name": "Organic Cotton",
      "batch_number": "BATCH-2024-001",
      "quantity_used": 250,
      "supplier": {
        "name": "Eco Cotton Suppliers",
        "country": "India",
        "certifications": "GOTS, OEKO-TEX"
      }
    }
  ]
}
```

---

## 📊 IoT Data Ingestion

### Ingest Sensor Data (Batch)

**Endpoint:** `POST /ingest/iot`

```json
[
  {
    "device_id": "DEVICE-ENERGY-001",
    "timestamp": "2024-01-15T10:30:00Z",
    "kwh": 5.2,
    "voltage": 230,
    "current": 10.5,
    "power_factor": 0.95
  },
  {
    "device_id": "DEVICE-WATER-001",
    "timestamp": "2024-01-15T10:30:00Z",
    "flow_rate": 150.5,
    "volume_liters": 1000,
    "ph": 7.2,
    "tds": 450,
    "temperature": 25.5
  },
  {
    "device_id": "DEVICE-WASTE-001",
    "timestamp": "2024-01-15T10:30:00Z",
    "waste_type": "Fabric Waste",
    "weight_kg": 50.5,
    "disposal_method": "Recycling",
    "notes": "Cotton scraps from production"
  }
]
```

**Response:**
```json
{
  "success": 3,
  "failed": 0,
  "errors": []
}
```

---

## 📈 ESG Compliance Reports

### Generate Report

**Endpoint:** `POST /reports/generate`

```json
{
  "report_type": "GRI",
  "start_date": "2024-01-01",
  "end_date": "2024-12-31"
}
```

**Report Types:**
- `GRI` - Global Reporting Initiative
- `CSDDD` - Corporate Sustainability Due Diligence Directive

**Response:**
```json
{
  "id": "report-uuid",
  "report_type": "GRI",
  "start_date": "2024-01-01",
  "end_date": "2024-12-31",
  "report_content": "# GRI ESG Compliance Report\n\n## Executive Summary\n...",
  "created_at": "2024-01-15T10:30:00Z",
  "metrics": {
    "total_energy_kwh": 125000.50,
    "total_water_liters": 500000.00,
    "total_waste_kg": 1500.75,
    "avg_energy_per_unit": 25.50,
    "carbon_footprint_estimate": 52500.21,
    "water_efficiency": 100.00,
    "waste_recycled_percentage": 75.0
  }
}
```

### List All Reports

**Endpoint:** `GET /reports`

### Download Specific Report

**Endpoint:** `GET /reports/{report_id}`

---

## 🔬 Testing Workflow

### Complete End-to-End Test

1. **Register & Login**
   - Register company and admin user
   - Save access token

2. **Set Up Infrastructure**
   - Create factory
   - Create suppliers
   - Register IoT devices

3. **Ingest IoT Data**
   - Send sensor data for energy, water, waste
   - Continue over several days

4. **Create Supply Chain**
   - Add raw material batches
   - Create production run linking materials
   - Generate finished goods with QR codes

5. **Verify Traceability**
   - Use QR code to lookup full chain (public endpoint)

6. **Generate Reports**
   - Generate ESG compliance report
   - Review metrics and AI-generated content

7. **Check Audit Logs**
   - All mutations should be logged automatically

---

## 🧪 Sample cURL Commands

### Register
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"company_name":"Green Apparel","company_email":"info@green.lk","first_name":"John","last_name":"Doe","email":"john@green.lk","password":"SecurePass123!"}'
```

### Create Factory
```bash
curl -X POST http://localhost:3000/factories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Factory 1","city":"Colombo","country":"Sri Lanka"}'
```

### QR Lookup (Public)
```bash
curl http://localhost:3000/trace/CC-Ab3xY9Zk7Mn2
```

---

## 📝 Notes

- All protected endpoints require `Authorization: Bearer {token}` header
- Dates should be in ISO 8601 format: `YYYY-MM-DD`
- UUIDs are auto-generated for all entities
- QR codes are auto-generated with format `CC-{12-char-nanoid}`
- All queries are automatically filtered by company_id from JWT

---

## 🔍 Swagger/OpenAPI

For interactive API testing, visit:
**http://localhost:3000/api**

This provides:
- Complete API documentation
- Try-it-out functionality
- Request/response schemas
- Authentication support

---

**Happy Testing! 🎉**
