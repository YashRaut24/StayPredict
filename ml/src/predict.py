"""
StayPredict — Inference Service Module
Single-patient prediction function for the FastAPI ML Service.
"""
import joblib
import pandas as pd
from typing import Dict, Any, Union
from ml.src.config import MODEL_PATH, PREPROCESSOR_PATH, METADATA_PATH, ALL_FEATURE_COLUMNS
from ml.src.feature_engineering import engineer_temporal_features


class LengthOfStayPredictor:
    """
    Singleton wrapper for loading model & preprocessor and generating predictions.
    """
    def __init__(self):
        self.model = None
        self.preprocessor = None
        self.metadata = None
        self._load_artifacts()

    def _load_artifacts(self):
        if not MODEL_PATH.exists() or not PREPROCESSOR_PATH.exists():
            raise FileNotFoundError("Model or Preprocessor artifact missing. Train model first.")
        self.model = joblib.load(MODEL_PATH)
        self.preprocessor = joblib.load(PREPROCESSOR_PATH)
        self.metadata = joblib.load(METADATA_PATH)

    def predict(self, patient_data: Union[Dict[str, Any], pd.DataFrame]) -> Dict[str, Any]:
        """
        Accepts patient admission details as a dict or DataFrame:
        Required fields:
        - Age (int)
        - Gender (Male/Female)
        - Blood Type (e.g. 'O+', 'A-')
        - Medical Condition (e.g. 'Asthma', 'Cancer', 'Diabetes')
        - Insurance Provider (e.g. 'Medicare', 'Aetna', 'Cigna')
        - Admission Type (e.g. 'Emergency', 'Elective', 'Urgent')
        - Date of Admission (e.g. '2024-04-15' or datetime)
        """
        if isinstance(patient_data, dict):
            df = pd.DataFrame([patient_data])
        else:
            df = patient_data.copy()

        # Step 1: Feature Engineering (Date decomposition if date is provided)
        if "Admission Year" not in df.columns:
            df = engineer_temporal_features(df, date_column="Date of Admission")

        # Step 2: Ensure all required feature columns exist in exact order
        X_input = df[ALL_FEATURE_COLUMNS]

        # Step 3: Transform through fitted ColumnTransformer
        X_proc = self.preprocessor.transform(X_input)

        # Step 4: Predict length of stay
        predicted_stay = float(self.model.predict(X_proc)[0])

        return {
            "predicted_stay_days": round(predicted_stay, 1),
            "raw_prediction": round(predicted_stay, 4),
            "model_version": self.metadata.get("model_version", "1.0.0"),
            "model_name": self.metadata.get("model_name", "Random Forest Regressor")
        }


# Global singleton instance for high-throughput API reuse
_predictor_instance = None


def get_predictor() -> LengthOfStayPredictor:
    global _predictor_instance
    if _predictor_instance is None:
        _predictor_instance = LengthOfStayPredictor()
    return _predictor_instance


def predict_single_patient(patient_dict: Dict[str, Any]) -> Dict[str, Any]:
    """
    Convenience functional API for single-patient predictions.
    """
    predictor = get_predictor()
    return predictor.predict(patient_dict)
