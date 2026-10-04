"""
StayPredict — Feature Engineering Module
Stateless functions for date decomposition and dataset hygiene.
"""
import pandas as pd
from typing import Tuple
from ml.src.config import TARGET_COLUMN, NUMERICAL_FEATURES, CATEGORICAL_FEATURES, ALL_FEATURE_COLUMNS


def engineer_temporal_features(df: pd.DataFrame, date_column: str = "Date of Admission") -> pd.DataFrame:
    """
    Decomposes admission date into cyclical temporal features:
    - Admission Year
    - Admission Month
    - Admission Day
    - Admission Day of Week (0 = Monday, 6 = Sunday)
    """
    df = df.copy()
    
    # Ensure datetime format
    if not pd.api.types.is_datetime64_any_dtype(df[date_column]):
        df[date_column] = pd.to_datetime(df[date_column])
        
    df["Admission Year"] = df[date_column].dt.year
    df["Admission Month"] = df[date_column].dt.month
    df["Admission Day"] = df[date_column].dt.day
    df["Admission Day of Week"] = df[date_column].dt.dayofweek
    
    return df


def clean_raw_dataset(raw_df: pd.DataFrame) -> pd.DataFrame:
    """
    Deduplicates raw dataset and constructs validated target 'Length of Stay'.
    Used during initial offline processing.
    """
    # Drop exact duplicate rows (synthetic generation artifacts)
    df_clean = raw_df.drop_duplicates().copy()
    
    # Parse dates
    df_clean["Date of Admission"] = pd.to_datetime(df_clean["Date of Admission"])
    df_clean["Discharge Date"] = pd.to_datetime(df_clean["Discharge Date"])
    
    # Target construction: Length of Stay in integer days
    df_clean[TARGET_COLUMN] = (df_clean["Discharge Date"] - df_clean["Date of Admission"]).dt.days
    
    # Target validation: discard non-positive stays if any
    df_clean = df_clean[df_clean[TARGET_COLUMN] > 0]
    
    return df_clean


def prepare_features_and_target(df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.Series]:
    """
    Extracts the feature matrix X (10 features) and target vector y.
    """
    if "Admission Year" not in df.columns and "Date of Admission" in df.columns:
        df = engineer_temporal_features(df)
        
    X = df[ALL_FEATURE_COLUMNS].copy()
    y = df[TARGET_COLUMN].copy() if TARGET_COLUMN in df.columns else None
    
    return X, y
