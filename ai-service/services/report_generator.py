from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import datetime
from typing import Dict, Any
import openai
from core.config import settings
from api.schemas import GenerateReportResponse, ESGMetrics

class ReportGeneratorService:
    def __init__(self, db: Session):
        self.db = db
        openai.api_key = settings.OPENAI_API_KEY
    
    async def generate_report(
        self,
        company_id: str,
        start_date: str,
        end_date: str,
        report_type: str
    ) -> GenerateReportResponse:
        """
        Generate ESG compliance report using AI.
        
        Steps:
        1. Aggregate data from TimescaleDB hypertables
        2. Calculate ESG metrics
        3. Generate narrative report using OpenAI
        """
        
        # Step 1: Aggregate energy data
        energy_data = self._aggregate_energy_metrics(company_id, start_date, end_date)
        
        # Step 2: Aggregate water data
        water_data = self._aggregate_water_metrics(company_id, start_date, end_date)
        
        # Step 3: Aggregate waste data
        waste_data = self._aggregate_waste_metrics(company_id, start_date, end_date)
        
        # Step 4: Get production data
        production_data = self._aggregate_production_metrics(company_id, start_date, end_date)
        
        # Step 5: Calculate ESG metrics
        metrics = self._calculate_esg_metrics(
            energy_data,
            water_data,
            waste_data,
            production_data
        )
        
        # Step 6: Generate AI report
        report_content = await self._generate_ai_report(
            metrics,
            report_type,
            start_date,
            end_date
        )
        
        return GenerateReportResponse(
            report_content=report_content,
            metrics=metrics,
            generated_at=datetime.utcnow()
        )
    
    def _aggregate_energy_metrics(self, company_id: str, start_date: str, end_date: str) -> Dict[str, Any]:
        """Query energy metrics from TimescaleDB"""
        query = text("""
            SELECT 
                SUM(em.kwh) as total_kwh,
                AVG(em.kwh) as avg_kwh,
                COUNT(*) as reading_count
            FROM energy_metrics em
            INNER JOIN iot_devices d ON em.device_id = d.device_id
            INNER JOIN factories f ON d.factory_id = f.id
            WHERE f.company_id = :company_id
            AND em.timestamp BETWEEN :start_date AND :end_date
        """)
        
        result = self.db.execute(
            query,
            {"company_id": company_id, "start_date": start_date, "end_date": end_date}
        ).first()
        
        return {
            "total_kwh": float(result[0] or 0),
            "avg_kwh": float(result[1] or 0),
            "reading_count": int(result[2] or 0)
        }
    
    def _aggregate_water_metrics(self, company_id: str, start_date: str, end_date: str) -> Dict[str, Any]:
        """Query water metrics from TimescaleDB"""
        query = text("""
            SELECT 
                SUM(wm.volume_liters) as total_liters,
                AVG(wm.flow_rate) as avg_flow_rate,
                COUNT(*) as reading_count
            FROM water_metrics wm
            INNER JOIN iot_devices d ON wm.device_id = d.device_id
            INNER JOIN factories f ON d.factory_id = f.id
            WHERE f.company_id = :company_id
            AND wm.timestamp BETWEEN :start_date AND :end_date
        """)
        
        result = self.db.execute(
            query,
            {"company_id": company_id, "start_date": start_date, "end_date": end_date}
        ).first()
        
        return {
            "total_liters": float(result[0] or 0),
            "avg_flow_rate": float(result[1] or 0),
            "reading_count": int(result[2] or 0)
        }
    
    def _aggregate_waste_metrics(self, company_id: str, start_date: str, end_date: str) -> Dict[str, Any]:
        """Query waste metrics from TimescaleDB"""
        query = text("""
            SELECT 
                SUM(wm.weight_kg) as total_weight_kg,
                COUNT(DISTINCT wm.waste_type) as waste_types,
                COUNT(*) as reading_count
            FROM waste_metrics wm
            INNER JOIN factories f ON wm.factory_id = f.id
            WHERE f.company_id = :company_id
            AND wm.timestamp BETWEEN :start_date AND :end_date
        """)
        
        result = self.db.execute(
            query,
            {"company_id": company_id, "start_date": start_date, "end_date": end_date}
        ).first()
        
        return {
            "total_weight_kg": float(result[0] or 0),
            "waste_types": int(result[1] or 0),
            "reading_count": int(result[2] or 0)
        }
    
    def _aggregate_production_metrics(self, company_id: str, start_date: str, end_date: str) -> Dict[str, Any]:
        """Query production data"""
        query = text("""
            SELECT 
                SUM(pr.units_produced) as total_units,
                COUNT(*) as production_runs
            FROM production_runs pr
            INNER JOIN factories f ON pr.factory_id = f.id
            WHERE f.company_id = :company_id
            AND pr.start_date BETWEEN :start_date AND :end_date
        """)
        
        result = self.db.execute(
            query,
            {"company_id": company_id, "start_date": start_date, "end_date": end_date}
        ).first()
        
        return {
            "total_units": int(result[0] or 0),
            "production_runs": int(result[1] or 0)
        }
    
    def _calculate_esg_metrics(
        self,
        energy_data: Dict,
        water_data: Dict,
        waste_data: Dict,
        production_data: Dict
    ) -> ESGMetrics:
        """Calculate ESG KPIs"""
        total_units = production_data["total_units"] or 1  # Avoid division by zero
        
        return ESGMetrics(
            total_energy_kwh=energy_data["total_kwh"],
            total_water_liters=water_data["total_liters"],
            total_waste_kg=waste_data["total_weight_kg"],
            avg_energy_per_unit=energy_data["total_kwh"] / total_units,
            carbon_footprint_estimate=energy_data["total_kwh"] * 0.42,  # Simplified: 0.42 kg CO2 per kWh
            water_efficiency=water_data["total_liters"] / total_units,
            waste_recycled_percentage=75.0  # Placeholder - would need actual recycling data
        )
    
    async def _generate_ai_report(
        self,
        metrics: ESGMetrics,
        report_type: str,
        start_date: str,
        end_date: str
    ) -> str:
        """Generate narrative report using OpenAI"""
        
        prompt = f"""
You are an expert ESG compliance officer specializing in {report_type} standards for the apparel manufacturing industry.

Generate a comprehensive ESG compliance report based on the following data:

**Reporting Period:** {start_date} to {end_date}

**Environmental Metrics:**
- Total Energy Consumption: {metrics.total_energy_kwh:.2f} kWh
- Total Water Usage: {metrics.total_water_liters:.2f} liters
- Total Waste Generated: {metrics.total_waste_kg:.2f} kg
- Average Energy per Unit: {metrics.avg_energy_per_unit:.2f} kWh/unit
- Estimated Carbon Footprint: {metrics.carbon_footprint_estimate:.2f} kg CO2
- Water Efficiency: {metrics.water_efficiency:.2f} liters/unit
- Waste Recycled: {metrics.waste_recycled_percentage:.1f}%

**Instructions:**
1. Write in a formal, professional tone suitable for stakeholders and regulators
2. Follow {report_type} reporting standards
3. Include an executive summary
4. Analyze the environmental performance
5. Provide actionable recommendations for improvement
6. Highlight achievements and areas of concern
7. Structure the report with clear sections and headings

Generate a detailed report (approximately 1000-1500 words):
"""
        
        try:
            response = openai.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an ESG compliance expert for apparel manufacturing."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            return response.choices[0].message.content
        except Exception as e:
            # Fallback if OpenAI fails
            return self._generate_fallback_report(metrics, report_type, start_date, end_date)
    
    def _generate_fallback_report(self, metrics: ESGMetrics, report_type: str, start_date: str, end_date: str) -> str:
        """Generate basic report without AI as fallback"""
        return f"""
# {report_type} ESG Compliance Report

**Reporting Period:** {start_date} to {end_date}

## Executive Summary
This report provides an overview of our environmental performance during the specified period.

## Environmental Performance

### Energy Consumption
- Total Energy: {metrics.total_energy_kwh:.2f} kWh
- Average per Unit: {metrics.avg_energy_per_unit:.2f} kWh/unit
- Estimated Carbon Footprint: {metrics.carbon_footprint_estimate:.2f} kg CO2

### Water Usage
- Total Water Consumption: {metrics.total_water_liters:.2f} liters
- Water Efficiency: {metrics.water_efficiency:.2f} liters/unit

### Waste Management
- Total Waste Generated: {metrics.total_waste_kg:.2f} kg
- Waste Recycled: {metrics.waste_recycled_percentage:.1f}%

## Recommendations
1. Continue monitoring energy consumption patterns
2. Implement water-saving initiatives
3. Increase waste recycling efforts
4. Adopt renewable energy sources where possible

---
*Generated by CertusChain AI Service*
"""
