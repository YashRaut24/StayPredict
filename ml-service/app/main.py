"""
StayPredict — FastAPI Machine Learning Microservice
Exposes REST endpoints for hospital length-of-stay predictions with risk assessment and care roadmaps.
"""
import datetime
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import (
    PatientPredictionRequest, PredictionResponse,
    HealthResponse, ModelInfoResponse
)
from app.predictor import service_predictor

# Initialize FastAPI App
app = FastAPI(
    title="StayPredict — ML Inference Service",
    description="High-performance machine learning microservice for predicting hospital length of stay.",
    version="1.0.0"
)

# Enable CORS for local development and Node/Express backend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse, tags=["Monitoring"])
def health_check():
    """
    Health check endpoint for container orchestration and uptime monitoring.
    """
    return {
        "status": "healthy" if service_predictor.is_loaded else "degraded",
        "service": "StayPredict ML Inference API",
        "model_loaded": service_predictor.is_loaded,
        "model_version": service_predictor.metadata.get("model_version", "1.0.0"),
        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }


@app.get("/model-info", response_model=ModelInfoResponse, tags=["Model Audit"])
def get_model_info():
    """
    Returns training metadata, feature schema, and evaluation metrics.
    """
    if not service_predictor.is_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model artifacts are not loaded"
        )
    return service_predictor.metadata


@app.post("/predict", response_model=PredictionResponse, status_code=status.HTTP_200_OK, tags=["Inference"])
def predict_stay(request: PatientPredictionRequest):
    """
    Predicts patient length of stay, calculates prolonged stay risk, clinical interventions, and recovery roadmap.
    """
    try:
        result = service_predictor.predict_length_of_stay(request.model_dump())
        return {
            "predicted_stay_days": result["predicted_stay_days"],
            "prolonged_stay_risk_pct": result["prolonged_stay_risk_pct"],
            "risk_level": result["risk_level"],
            "confidence_interval": result["confidence_interval"],
            "clinical_interventions": result["clinical_interventions"],
            "recovery_roadmap": result["recovery_roadmap"],
            "model_version": result["model_version"],
            "model_name": result["model_name"],
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference error: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
