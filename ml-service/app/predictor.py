"""
StayPredict — ML Service Prediction Adapter
Loads serialized artifacts and executes inference pipeline.
"""
import joblib
import pandas as pd
from pathlib import Path
from typing import Dict, Any

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

    def predict_length_of_stay(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Accepts validated input from PatientPredictionRequest,
        transforms to expected tabular structure, and predicts.
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

        # Predict length of stay
        prediction = float(self.model.predict(X_processed)[0])

        return {
            "predicted_stay_days": round(prediction, 1),
            "model_version": self.metadata.get("model_version", "1.0.0"),
            "model_name": self.metadata.get("model_name", "Random Forest Regressor")
        }


# Singleton service instance
service_predictor = MLServicePredictor()
