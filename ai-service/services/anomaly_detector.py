from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import datetime, timedelta
from typing import List
import numpy as np
from sklearn.ensemble import IsolationForest
from api.schemas import DetectAnomaliesResponse, Anomaly

class AnomalyDetectorService:
    def __init__(self, db: Session):
        self.db = db
    
    async def detect_anomalies(
        self,
        factory_id: str,
        metric_type: str
    ) -> DetectAnomaliesResponse:
        """
        Detect anomalies in time-series IoT data using ML.
        
        Uses Isolation Forest algorithm for anomaly detection.
        """
        
        # Query last 7 days of data
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=7)
        
        # Get time-series data based on metric type
        if metric_type == "ENERGY":
            data = self._get_energy_data(factory_id, start_date, end_date)
        elif metric_type == "WATER":
            data = self._get_water_data(factory_id, start_date, end_date)
        elif metric_type == "WASTE":
            data = self._get_waste_data(factory_id, start_date, end_date)
        else:
            raise ValueError(f"Invalid metric_type: {metric_type}")
        
        if not data:
            return DetectAnomaliesResponse(
                anomalies=[],
                total_anomalies=0,
                analysis_period=f"{start_date.isoformat()} to {end_date.isoformat()}"
            )
        
        # Detect anomalies using ML
        anomalies = self._detect_anomalies_ml(data)
        
        return DetectAnomaliesResponse(
            anomalies=anomalies,
            total_anomalies=len(anomalies),
            analysis_period=f"{start_date.isoformat()} to {end_date.isoformat()}"
        )
    
    def _get_energy_data(self, factory_id: str, start_date: datetime, end_date: datetime) -> List[dict]:
        """Query energy metrics"""
        query = text("""
            SELECT 
                em.timestamp,
                em.kwh as value
            FROM energy_metrics em
            INNER JOIN iot_devices d ON em.device_id = d.device_id
            WHERE d.factory_id = :factory_id
            AND em.timestamp BETWEEN :start_date AND :end_date
            ORDER BY em.timestamp
        """)
        
        results = self.db.execute(
            query,
            {"factory_id": factory_id, "start_date": start_date, "end_date": end_date}
        ).fetchall()
        
        return [{"timestamp": row[0], "value": float(row[1])} for row in results if row[1] is not None]
    
    def _get_water_data(self, factory_id: str, start_date: datetime, end_date: datetime) -> List[dict]:
        """Query water metrics"""
        query = text("""
            SELECT 
                wm.timestamp,
                wm.flow_rate as value
            FROM water_metrics wm
            INNER JOIN iot_devices d ON wm.device_id = d.device_id
            WHERE d.factory_id = :factory_id
            AND wm.timestamp BETWEEN :start_date AND :end_date
            ORDER BY wm.timestamp
        """)
        
        results = self.db.execute(
            query,
            {"factory_id": factory_id, "start_date": start_date, "end_date": end_date}
        ).fetchall()
        
        return [{"timestamp": row[0], "value": float(row[1])} for row in results if row[1] is not None]
    
    def _get_waste_data(self, factory_id: str, start_date: datetime, end_date: datetime) -> List[dict]:
        """Query waste metrics"""
        query = text("""
            SELECT 
                wm.timestamp,
                wm.weight_kg as value
            FROM waste_metrics wm
            WHERE wm.factory_id = :factory_id
            AND wm.timestamp BETWEEN :start_date AND :end_date
            ORDER BY wm.timestamp
        """)
        
        results = self.db.execute(
            query,
            {"factory_id": factory_id, "start_date": start_date, "end_date": end_date}
        ).fetchall()
        
        return [{"timestamp": row[0], "value": float(row[1])} for row in results if row[1] is not None]
    
    def _detect_anomalies_ml(self, data: List[dict]) -> List[Anomaly]:
        """
        Use Isolation Forest to detect anomalies.
        
        Isolation Forest is effective for detecting outliers in time-series data.
        """
        if len(data) < 10:
            # Not enough data for meaningful anomaly detection
            return []
        
        # Extract values
        values = np.array([d["value"] for d in data]).reshape(-1, 1)
        timestamps = [d["timestamp"] for d in data]
        
        # Train Isolation Forest
        model = IsolationForest(
            contamination=0.1,  # Expect 10% of data to be anomalies
            random_state=42
        )
        
        # Fit and predict
        predictions = model.fit_predict(values)
        anomaly_scores = model.score_samples(values)
        
        # Extract anomalies (predictions == -1)
        anomalies = []
        for i, pred in enumerate(predictions):
            if pred == -1:
                score = abs(anomaly_scores[i])
                severity = self._calculate_severity(score)
                
                anomalies.append(Anomaly(
                    timestamp=timestamps[i],
                    value=float(values[i][0]),
                    anomaly_score=float(score),
                    severity=severity
                ))
        
        # Sort by timestamp
        anomalies.sort(key=lambda x: x.timestamp)
        
        return anomalies
    
    def _calculate_severity(self, score: float) -> str:
        """Calculate severity based on anomaly score"""
        if score > 0.5:
            return "high"
        elif score > 0.3:
            return "medium"
        else:
            return "low"
