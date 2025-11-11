from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from api.schemas import GenerateReportRequest, GenerateReportResponse, DetectAnomaliesRequest, DetectAnomaliesResponse
from services.report_generator import ReportGeneratorService
from services.anomaly_detector import AnomalyDetectorService

ai_router = APIRouter()

@ai_router.post("/generate-report", response_model=GenerateReportResponse)
async def generate_report(
    request: GenerateReportRequest,
    db: Session = Depends(get_db)
):
    """
    Generate ESG compliance report using AI.
    Called internally by NestJS Core API.
    """
    try:
        service = ReportGeneratorService(db)
        result = await service.generate_report(
            company_id=request.company_id,
            start_date=request.start_date,
            end_date=request.end_date,
            report_type=request.report_type
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@ai_router.post("/detect-anomalies", response_model=DetectAnomaliesResponse)
async def detect_anomalies(
    request: DetectAnomaliesRequest,
    db: Session = Depends(get_db)
):
    """
    Detect anomalies in time-series IoT data using ML.
    Called internally by NestJS Core API.
    """
    try:
        service = AnomalyDetectorService(db)
        result = await service.detect_anomalies(
            factory_id=request.factory_id,
            metric_type=request.metric_type
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
