"""
StayPredict — Production Training Pipeline
Automated end-to-end training and artifact serialization script.
Run via: python -m ml.src.train
"""
import time
import datetime
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

from ml.src.config import (
    CLEANED_DATA_PATH, RAW_DATA_PATH, MODEL_PATH, METADATA_PATH,
    PREPROCESSOR_PATH, SPLIT_DATA_PATH, BEST_RF_PARAMS,
    RANDOM_STATE, TEST_SIZE
)
from ml.src.feature_engineering import clean_raw_dataset, prepare_features_and_target
from ml.src.data_preprocessing import fit_and_save_preprocessor


def run_training_pipeline():
    print("=" * 60)
    print("STAYPREDICT: Commencing Production Model Training Pipeline")
    print("=" * 60)
    
    # 1. Load Data
    if CLEANED_DATA_PATH.exists():
        print(f"Loading cleaned dataset: {CLEANED_DATA_PATH.name}")
        df = pd.read_csv(CLEANED_DATA_PATH)
    else:
        print(f"Cleaned dataset not found. Generating from raw data: {RAW_DATA_PATH.name}")
        raw_df = pd.read_csv(RAW_DATA_PATH)
        df = clean_raw_dataset(raw_df)
        CLEANED_DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
        df.to_csv(CLEANED_DATA_PATH, index=False)
        
    print(f"Dataset shape: {df.shape[0]:,} rows, {df.shape[1]} columns")
    
    # 2. Extract Features and Target
    X, y = prepare_features_and_target(df)
    print(f"Features: {X.shape[1]} columns (5 numeric/temporal, 5 categorical)")
    
    # 3. Train/Test Split (80/20)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE
    )
    print(f"Split: {len(X_train):,} train samples, {len(X_test):,} test samples")
    
    # 4. Preprocessing Pipeline
    print("Fitting ColumnTransformer on X_train...")
    preprocessor = fit_and_save_preprocessor(X_train, PREPROCESSOR_PATH)
    
    X_train_proc = preprocessor.transform(X_train)
    X_test_proc = preprocessor.transform(X_test)
    print(f"Encoded feature count: {X_train_proc.shape[1]}")
    
    # 5. Train Random Forest Model
    print("\nTraining Tuned Random Forest Regressor...")
    start_time = time.time()
    model = RandomForestRegressor(**BEST_RF_PARAMS)
    model.fit(X_train_proc, y_train)
    train_time = time.time() - start_time
    print(f"Training completed in {train_time:.2f} seconds.")
    
    # 6. Evaluation on Unseen Test Set
    test_preds = model.predict(X_test_proc)
    mae = mean_absolute_error(y_test, test_preds)
    rmse = np.sqrt(mean_squared_error(y_test, test_preds))
    r2 = r2_score(y_test, test_preds)
    
    print("\n--- TEST SET EVALUATION METRICS ---")
    print(f"Mean Absolute Error (MAE): {mae:.4f} days")
    print(f"Root Mean Squared Error:   {rmse:.4f} days")
    print(f"R² Score:                  {r2:.4f}")
    
    # 7. Serialize Artifacts
    print("\nSerializing production artifacts...")
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    
    metadata = {
        "model_name": "StayPredict Random Forest Regressor",
        "model_version": "1.0.0",
        "trained_date": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "target": "Length of Stay (days)",
        "features": list(X.columns),
        "metrics": {
            "test_mae_days": round(mae, 4),
            "test_rmse_days": round(rmse, 4),
            "test_r2": round(r2, 4),
            "train_time_seconds": round(train_time, 2)
        }
    }
    joblib.dump(metadata, METADATA_PATH)
    
    # Also save split data for standalone evaluation
    joblib.dump({
        "X_test": X_test,
        "y_test": y_test,
        "X_test_processed": X_test_proc
    }, SPLIT_DATA_PATH)
    
    print(f"✓ Saved Model:        {MODEL_PATH.resolve()}")
    print(f"✓ Saved Preprocessor: {PREPROCESSOR_PATH.resolve()}")
    print(f"✓ Saved Metadata:     {METADATA_PATH.resolve()}")
    print("=" * 60)
    print("Pipeline finished successfully!")


if __name__ == "__main__":
    run_training_pipeline()
