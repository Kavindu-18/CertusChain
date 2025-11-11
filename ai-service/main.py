from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import ai_router
from core.config import settings

app = FastAPI(
    title="CertusChain AI/ML Service",
    description="AI-powered ESG report generation and anomaly detection",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(ai_router, prefix="/ai", tags=["AI/ML"])

@app.get("/")
async def root():
    return {
        "service": "CertusChain AI/ML Service",
        "status": "running",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
