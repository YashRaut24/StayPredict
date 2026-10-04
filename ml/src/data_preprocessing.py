"""
StayPredict — Data Preprocessing Pipeline Module
Factory for building, fitting, and persisting Scikit-Learn ColumnTransformers.
"""
import joblib
import pandas as pd
from pathlib import Path
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from ml.src.config import NUMERICAL_FEATURES, CATEGORICAL_FEATURES, PREPROCESSOR_PATH


def build_preprocessor() -> ColumnTransformer:
    """
    Constructs an isolated Scikit-learn ColumnTransformer:
    - Numerical: Median Imputer + StandardScaler
    - Categorical: Most-Frequent Imputer + OneHotEncoder(handle_unknown='ignore')
    """
    num_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ])
    
    cat_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
    ])
    
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", num_pipeline, NUMERICAL_FEATURES),
            ("cat", cat_pipeline, CATEGORICAL_FEATURES)
        ],
        remainder="drop"
    )
    
    return preprocessor


def fit_and_save_preprocessor(X_train: pd.DataFrame, save_path: Path = PREPROCESSOR_PATH) -> ColumnTransformer:
    """
    Fits the ColumnTransformer strictly on training features and exports to disk.
    """
    preprocessor = build_preprocessor()
    preprocessor.fit(X_train)
    
    save_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(preprocessor, save_path)
    return preprocessor


def load_preprocessor(load_path: Path = PREPROCESSOR_PATH) -> ColumnTransformer:
    """
    Loads fitted ColumnTransformer from disk.
    """
    if not load_path.exists():
        raise FileNotFoundError(f"Preprocessor artifact not found at {load_path}")
    return joblib.load(load_path)
