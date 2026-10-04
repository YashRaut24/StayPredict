"""
StayPredict — ML Configuration & Feature Definitions
Single source of truth for paths, column definitions, and model parameters.
"""
from pathlib import Path

# Base Paths (relative to project root)
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
RAW_DATA_PATH = DATA_DIR / "raw" / "healthcare_dataset.csv"
CLEANED_DATA_PATH = DATA_DIR / "processed" / "healthcare_cleaned.csv"
SPLIT_DATA_PATH = DATA_DIR / "processed" / "split_data.joblib"

MODELS_DIR = BASE_DIR / "models"
MODEL_PATH = MODELS_DIR / "best_model.joblib"
PREPROCESSOR_PATH = MODELS_DIR / "preprocessor.joblib"
METADATA_PATH = MODELS_DIR / "model_metadata.joblib"

# Target Definition
TARGET_COLUMN = "Length of Stay"

# Feature Partitions
NUMERICAL_FEATURES = [
    "Age",
    "Admission Year",
    "Admission Month",
    "Admission Day",
    "Admission Day of Week"
]

CATEGORICAL_FEATURES = [
    "Gender",
    "Blood Type",
    "Medical Condition",
    "Insurance Provider",
    "Admission Type"
]

ALL_FEATURE_COLUMNS = NUMERICAL_FEATURES + CATEGORICAL_FEATURES

# Columns strictly excluded at admission time to prevent data leakage & memorization
EXCLUDED_COLUMNS = [
    "Name",
    "Doctor",
    "Hospital",
    "Billing Amount",
    "Room Number",
    "Discharge Date",
    "Medication",
    "Test Results"
]

# Random Forest Best Hyperparameters (obtained from Phase 10 Tuning)
BEST_RF_PARAMS = {
    "n_estimators": 200,
    "max_depth": 12,
    "min_samples_split": 10,
    "min_samples_leaf": 8,
    "max_features": "sqrt",
    "random_state": 42,
    "n_jobs": -1
}

# Training Configuration
RANDOM_STATE = 42
TEST_SIZE = 0.20
