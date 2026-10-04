"""
StayPredict — Independent Model Evaluation Script
Audits saved model performance on test data.
Run via: python -m ml.src.evaluate
"""
import joblib
import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from ml.src.config import MODEL_PATH, METADATA_PATH, SPLIT_DATA_PATH


def run_evaluation():
    print("=" * 60)
    print("STAYPREDICT: Evaluating Serialized Model Performance")
    print("=" * 60)
    
    # Verify artifact existence
    if not MODEL_PATH.exists() or not SPLIT_DATA_PATH.exists():
        raise FileNotFoundError("Missing model or test split artifacts. Please run train.py first.")
        
    model = joblib.load(MODEL_PATH)
    metadata = joblib.load(METADATA_PATH)
    split_data = joblib.load(SPLIT_DATA_PATH)
    
    X_test_proc = split_data["X_test_processed"]
    y_test = split_data["y_test"]
    
    # Predict
    preds = model.predict(X_test_proc)
    residuals = y_test - preds
    
    mae = mean_absolute_error(y_test, preds)
    rmse = np.sqrt(mean_squared_error(y_test, preds))
    r2 = r2_score(y_test, preds)
    
    print(f"Model:        {metadata['model_name']} (v{metadata['model_version']})")
    print(f"Trained On:   {metadata['trained_date']}")
    print(f"Test Samples: {len(y_test):,}")
    print("-" * 60)
    print(f"Test MAE (Mean Absolute Error): {mae:.4f} days")
    print(f"Test RMSE (Root Mean Squared):  {rmse:.4f} days")
    print(f"Test R² (Variance Explained):   {r2:.4f}")
    print(f"Mean Residual (Bias):           {residuals.mean():.4f} days")
    print("=" * 60)


if __name__ == "__main__":
    run_evaluation()
