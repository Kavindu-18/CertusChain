from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

# Report Generation
class GenerateReportRequest(BaseModel):
    company_id: str
    start_date: str
    end_date: str
    report_type: str = "GRI"

class ESGMetrics(BaseModel):
    total_energy_kwh: float
    total_water_liters: float
    total_waste_kg: float
    avg_energy_per_unit: float
    carbon_footprint_estimate: float
    water_efficiency: float
    waste_recycled_percentage: float

class GenerateReportResponse(BaseModel):
    report_content: str
    metrics: ESGMetrics
    generated_at: datetime

# Anomaly Detection
class DetectAnomaliesRequest(BaseModel):
    factory_id: str
    metric_type: str  # "ENERGY", "WATER", "WASTE"

class Anomaly(BaseModel):
    timestamp: datetime
    value: float
    anomaly_score: float
    severity: str  # "low", "medium", "high"

class DetectAnomaliesResponse(BaseModel):
    anomalies: List[Anomaly]
    total_anomalies: int
    analysis_period: str
