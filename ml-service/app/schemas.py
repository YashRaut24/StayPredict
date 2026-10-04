"""
StayPredict — Pydantic Schemas for Request & Response Validation
"""
from enum import Enum
from datetime import date, datetime
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field


# Enums matching exact categories from training data
class GenderEnum(str, Enum):
    Male = "Male"
    Female = "Female"


class BloodTypeEnum(str, Enum):
    A_POS = "A+"
    A_NEG = "A-"
    B_POS = "B+"
    B_NEG = "B-"
    AB_POS = "AB+"
    AB_NEG = "AB-"
    O_POS = "O+"
    O_NEG = "O-"


class MedicalConditionEnum(str, Enum):
    Arthritis = "Arthritis"
    Asthma = "Asthma"
    Cancer = "Cancer"
    Diabetes = "Diabetes"
    Hypertension = "Hypertension"
    Obesity = "Obesity"


class InsuranceProviderEnum(str, Enum):
    Aetna = "Aetna"
    BlueCross = "Blue Cross"
    Cigna = "Cigna"
    Medicare = "Medicare"
    UnitedHealthcare = "UnitedHealthcare"


class AdmissionTypeEnum(str, Enum):
    Elective = "Elective"
    Emergency = "Emergency"
    Urgent = "Urgent"


class PatientPredictionRequest(BaseModel):
    age: int = Field(..., ge=0, le=120, description="Patient age in years (0-120)")
    gender: GenderEnum = Field(..., description="Patient biological sex")
    blood_type: BloodTypeEnum = Field(..., description="Patient blood group")
    medical_condition: MedicalConditionEnum = Field(..., description="Primary admitting diagnosis")
    insurance_provider: InsuranceProviderEnum = Field(..., description="Health insurance coverage")
    admission_type: AdmissionTypeEnum = Field(..., description="Hospital admission triage type")
    date_of_admission: date = Field(..., description="Admission date (YYYY-MM-DD)")

    model_config = {
        "json_schema_extra": {
            "example": {
                "age": 52,
                "gender": "Female",
                "blood_type": "O+",
                "medical_condition": "Diabetes",
                "insurance_provider": "Medicare",
                "admission_type": "Emergency",
                "date_of_admission": "2024-06-15"
            }
        }
    }


class ConfidenceInterval(BaseModel):
    min_days: float
    max_days: float


class RoadmapMilestone(BaseModel):
    phase: str
    target_day: str
    title: str
    description: str


class PredictionResponse(BaseModel):
    predicted_stay_days: float = Field(..., description="Predicted length of hospital stay in days")
    prolonged_stay_risk_pct: float = Field(..., description="Ensemble probability of stay exceeding 14 days")
    risk_level: str = Field(..., description="Prolonged stay risk category (Low, Moderate, High Risk)")
    confidence_interval: ConfidenceInterval = Field(..., description="80% confidence window from model trees")
    clinical_interventions: List[str] = Field(..., description="Actionable clinical care protocols for clinicians")
    recovery_roadmap: List[RoadmapMilestone] = Field(..., description="Day-by-day care trajectory for patients")
    model_version: str = Field(..., description="Version of the model that generated prediction")
    model_name: str = Field(..., description="Algorithm used for inference")
    status: str = Field("success", description="Prediction status")


class HealthResponse(BaseModel):
    status: str
    service: str
    model_loaded: bool
    model_version: str
    timestamp: str


class ModelInfoResponse(BaseModel):
    model_name: str
    model_version: str
    trained_date: str
    target: str
    features: List[str]
    metrics: Dict[str, Any]
