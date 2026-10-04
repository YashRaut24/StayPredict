"""
StayPredict — ML Service Prediction Adapter
Loads serialized artifacts and executes inference pipeline with risk stratification and clinical roadmaps.
"""
import joblib
import numpy as np
import pandas as pd
from pathlib import Path
from typing import Dict, Any, List

# Locate model artifacts in ml/models/ directory
APP_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = APP_DIR.parent.parent
MODELS_DIR = PROJECT_ROOT / "ml" / "models"

MODEL_PATH = MODELS_DIR / "best_model.joblib"
PREPROCESSOR_PATH = MODELS_DIR / "preprocessor.joblib"
METADATA_PATH = MODELS_DIR / "model_metadata.joblib"

# The 10 feature columns expected in exact order by ColumnTransformer
FEATURE_COLUMNS = [
    "Age",
    "Admission Year",
    "Admission Month",
    "Admission Day",
    "Admission Day of Week",
    "Gender",
    "Blood Type",
    "Medical Condition",
    "Insurance Provider",
    "Admission Type"
]


class MLServicePredictor:
    def __init__(self):
        self.model = None
        self.preprocessor = None
        self.metadata = None
        self.is_loaded = False
        self.load_artifacts()

    def load_artifacts(self):
        if not MODEL_PATH.exists() or not PREPROCESSOR_PATH.exists():
            raise FileNotFoundError(
                f"ML artifacts not found in {MODELS_DIR.resolve()}. "
                "Ensure Phase 13 training pipeline has been executed."
            )
            
        self.model = joblib.load(MODEL_PATH)
        self.preprocessor = joblib.load(PREPROCESSOR_PATH)
        self.metadata = joblib.load(METADATA_PATH) if METADATA_PATH.exists() else {}
        self.is_loaded = True

    def _generate_interventions(self, age: int, condition: str, acuity: str, stay_days: float) -> List[str]:
        interventions = []
        clean_acuity = str(acuity).replace("AdmissionTypeEnum.", "")
        clean_condition = str(condition).replace("MedicalConditionEnum.", "")

        if clean_acuity == "Emergency":
            interventions.append("Prioritize acute stabilization protocol & expedite payer pre-authorization within 24 hours.")
        elif clean_acuity == "Urgent":
            interventions.append("Conduct comprehensive specialty consult within 12 hours of ward admission.")
        else:
            interventions.append("Initiate planned clinical pathway and pre-booked diagnostic scheduling.")

        if age >= 65:
            interventions.append("Deploy geriatric assessment: evaluate fall risk, hydration status, and polypharmacy.")

        if condition == "Asthma":
            interventions.append("Initiate daily peak flow monitoring; transition nebulizer to metered-dose inhaler prior to discharge.")
        elif condition == "Diabetes":
            interventions.append("Establish sliding-scale insulin log; target fasting blood glucose between 90-130 mg/dL.")
        elif condition == "Cancer":
            interventions.append("Initiate protective neutropenic precautions; coordinate daily absolute neutrophil count (ANC) tracking.")
        elif condition == "Hypertension":
            interventions.append("Continuous telemetry monitoring; verify 48-hour oral antihypertensive stability without orthostasis.")
        elif condition == "Arthritis":
            interventions.append("Schedule bedside physical therapy within 24 hours; evaluate independent ambulation milestones.")
        elif condition == "Obesity":
            interventions.append("Ensure bariatric bed ergonomics, DVT prophylaxis, and CPAP compliance verification.")

        if stay_days > 14:
            interventions.append("Multidisciplinary discharge planning team (MDT) review recommended at Day 5 to prevent delayed discharge.")

        return interventions

    def _generate_roadmap(self, condition: str, stay_days: float) -> List[Dict[str, str]]:
        clean_cond = str(condition).replace("MedicalConditionEnum.", "").replace("_", " ")
        total_d = max(3, round(stay_days))
        half_d = max(2, total_d // 2)
        pre_d = max(half_d + 1, total_d - 2)

        return [
            {
                "phase": "Intake & Clinical Stabilization",
                "target_day": "Days 1 - 2",
                "title": "Clinical Intake & Treatment Baseline",
                "description": f"Admission vitals verified, initial IV/oral therapy initiated for {clean_cond}, and baseline telemetry established."
            },
            {
                "phase": "Therapeutic Response & Review",
                "target_day": f"Days 3 - {half_d}",
                "title": "Mid-Stay Clinical Evaluation",
                "description": "Multidisciplinary team rounds evaluate therapeutic response, lab biomarkers, and symptom resolution."
            },
            {
                "phase": "Discharge Clearance & Preparation",
                "target_day": f"Days {pre_d} - {total_d - 1}",
                "title": "48-Hour Pre-Discharge Clearance",
                "description": "Pharmacy take-home medication reconciliation, family transport confirmation, and post-discharge clinic booking."
            },
            {
                "phase": "Discharge Day & Outpatient Transition",
                "target_day": f"Day {total_d}",
                "title": "Physician Handover & Home Release",
                "description": "Final morning vitals sign-off, delivery of discharge packet, and formal transition to outpatient primary care."
            }
        ]

    def predict_length_of_stay(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Accepts validated input from PatientPredictionRequest,
        transforms to expected tabular structure, and executes ensemble inference.
        """
        if not self.is_loaded:
            self.load_artifacts()

        # Parse date and engineer calendar features
        admission_date = pd.to_datetime(data["date_of_admission"])

        # Construct single-row DataFrame matching the 10 training features
        row = {
            "Age": data["age"],
            "Admission Year": admission_date.year,
            "Admission Month": admission_date.month,
            "Admission Day": admission_date.day,
            "Admission Day of Week": admission_date.dayofweek,
            "Gender": str(data["gender"]),
            "Blood Type": str(data["blood_type"]),
            "Medical Condition": str(data["medical_condition"]),
            "Insurance Provider": str(data["insurance_provider"]),
            "Admission Type": str(data["admission_type"])
        }

        df_input = pd.DataFrame([row])[FEATURE_COLUMNS]

        # Apply ColumnTransformer (Scaling + One-Hot Encoding)
        X_processed = self.preprocessor.transform(df_input)

        # 1. Main ensemble point prediction
        prediction = float(self.model.predict(X_processed)[0])
        stay_days = round(prediction, 1)

        # 2. Extract predictions from all 200 Random Forest trees
        tree_preds = np.array([tree.predict(X_processed)[0] for tree in self.model.estimators_])

        # 3. Calculate ensemble prolonged stay risk (% of trees predicting > 14 days)
        prolonged_risk_pct = round(float(np.mean(tree_preds > 14.0) * 100), 1)

        # 4. Statistical confidence interval (10th to 90th percentile)
        min_days = round(float(np.percentile(tree_preds, 10)), 1)
        max_days = round(float(np.percentile(tree_preds, 90)), 1)

        # 5. Risk classification
        if prolonged_risk_pct >= 65.0:
            risk_level = "High Prolonged Risk"
        elif prolonged_risk_pct >= 40.0:
            risk_level = "Moderate Stay Risk"
        else:
            risk_level = "Low / Standard Risk"

        # 6. Tailored clinical interventions for clinicians
        interventions = self._generate_interventions(
            age=data["age"],
            condition=str(data["medical_condition"]),
            acuity=str(data["admission_type"]),
            stay_days=stay_days
        )

        # 7. Day-by-day care trajectory roadmap for patients
        roadmap = self._generate_roadmap(
            condition=str(data["medical_condition"]),
            stay_days=stay_days
        )

        return {
            "predicted_stay_days": stay_days,
            "prolonged_stay_risk_pct": prolonged_risk_pct,
            "risk_level": risk_level,
            "confidence_interval": {
                "min_days": min_days,
                "max_days": max_days
            },
            "clinical_interventions": interventions,
            "recovery_roadmap": roadmap,
            "model_version": self.metadata.get("model_version", "1.0.0"),
            "model_name": self.metadata.get("model_name", "Random Forest Regressor")
        }


# Singleton service instance
service_predictor = MLServicePredictor()
