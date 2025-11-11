# CertusChain AI/ML Service

Python FastAPI microservice for AI-powered ESG report generation and ML-based anomaly detection.

## Features

- **ESG Report Generation**: AI-powered compliance report generation using OpenAI GPT-4
- **Anomaly Detection**: ML-based anomaly detection for IoT sensor data using Isolation Forest
- **Direct Database Access**: Queries TimescaleDB hypertables for time-series analytics
- **Internal API**: Designed to be called only by the NestJS Core API

## Tech Stack

- **Framework**: FastAPI 0.104+
- **AI/ML**: OpenAI GPT-4, scikit-learn, Prophet
- **Database**: PostgreSQL with TimescaleDB (shared with Core API)
- **Language**: Python 3.11+

## Setup

### Prerequisites
- Python 3.11+
- PostgreSQL 14+ with TimescaleDB
- OpenAI API key

### Installation

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Environment Variables

Create a `.env` file:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/certuschain
OPENAI_API_KEY=your-openai-api-key
PORT=8001
ENVIRONMENT=development
```

## Running the Service

### Development
```bash
uvicorn main:app --reload --port 8001
```

### Production
```bash
uvicorn main:app --host 0.0.0.0 --port 8001 --workers 4
```

### Using Docker
```bash
docker build -t certuschain-ai-service .
docker run -p 8001:8001 --env-file .env certuschain-ai-service
```

## API Endpoints

### Health Check
```
GET /health
```

### Generate ESG Report (Internal)
```
POST /ai/generate-report

Request Body:
{
  "company_id": "uuid",
  "start_date": "2024-01-01",
  "end_date": "2024-12-31",
  "report_type": "GRI"
}

Response:
{
  "report_content": "Full ESG report text...",
  "metrics": {
    "total_energy_kwh": 125000.50,
    "total_water_liters": 500000.00,
    "total_waste_kg": 1500.75,
    "avg_energy_per_unit": 25.50,
    "carbon_footprint_estimate": 52500.21,
    "water_efficiency": 100.00,
    "waste_recycled_percentage": 75.0
  },
  "generated_at": "2024-01-15T10:30:00Z"
}
```

### Detect Anomalies (Internal)
```
POST /ai/detect-anomalies

Request Body:
{
  "factory_id": "uuid",
  "metric_type": "ENERGY"
}

Response:
{
  "anomalies": [
    {
      "timestamp": "2024-01-15T14:30:00Z",
      "value": 500.5,
      "anomaly_score": 0.85,
      "severity": "high"
    }
  ],
  "total_anomalies": 5,
  "analysis_period": "2024-01-08T00:00:00Z to 2024-01-15T00:00:00Z"
}
```

## Architecture

### Report Generation Flow
1. Receives request from NestJS Core API
2. Queries TimescaleDB hypertables for energy, water, and waste metrics
3. Aggregates production data from relational tables
4. Calculates ESG KPIs (energy efficiency, carbon footprint, etc.)
5. Generates narrative report using OpenAI GPT-4
6. Returns structured report with metrics

### Anomaly Detection Flow
1. Receives request with factory_id and metric_type
2. Queries last 7 days of time-series data from TimescaleDB
3. Applies Isolation Forest ML algorithm to detect outliers
4. Calculates anomaly scores and severity levels
5. Returns list of detected anomalies with timestamps

## ML Models

### Isolation Forest
- **Purpose**: Detect anomalies in IoT sensor data
- **Algorithm**: Unsupervised learning, identifies outliers
- **Parameters**: 
  - Contamination: 0.1 (expects 10% anomalies)
  - Random state: 42 (for reproducibility)

### Future Enhancements
- Prophet for time-series forecasting
- LSTM for predictive maintenance
- Custom models for specific ESG metrics

## Database Queries

The service directly queries:
- `energy_metrics` (TimescaleDB hypertable)
- `water_metrics` (TimescaleDB hypertable)
- `waste_metrics` (TimescaleDB hypertable)
- `production_runs` (relational table)
- `factories` (relational table)

All queries are tenant-aware through company_id filtering.

## Error Handling

- Falls back to template-based reports if OpenAI API fails
- Returns empty anomaly lists for insufficient data
- Comprehensive error logging for debugging

## Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=.
```

## License
Proprietary - All rights reserved
