import React from 'react';
import { Calendar, Clock, CheckCircle2, AlertCircle, FileText, BedDouble } from 'lucide-react';
import './PredictionResult.css';

export default function PredictionResult({ prediction, patientData, onReset }) {
  if (!prediction) {
    return (
      <div className="result-placeholder-card">
        <div className="placeholder-icon-wrap">
          <BedDouble size={36} className="placeholder-icon" />
        </div>
        <h3 className="placeholder-title">Awaiting Clinical Inputs</h3>
        <p className="placeholder-desc">
          Complete the patient pre-admission form and submit to receive an instant machine learning Length-of-Stay projection.
        </p>
        <div className="model-guarantee-box">
          <div className="guarantee-item">
            <CheckCircle2 size={14} className="guarantee-icon" />
            <span>Zero post-admission data leakage</span>
          </div>
          <div className="guarantee-item">
            <CheckCircle2 size={14} className="guarantee-icon" />
            <span>Production Random Forest (MAE 7.47 days)</span>
          </div>
          <div className="guarantee-item">
            <CheckCircle2 size={14} className="guarantee-icon" />
            <span>Audit-ready MongoDB persistence</span>
          </div>
        </div>
      </div>
    );
  }

  const days = Number(prediction.predictedStayDays);

  // Compute Estimated Discharge Date
  let dischargeDateStr = 'N/A';
  if (patientData?.dateOfAdmission) {
    const admissionDate = new Date(patientData.dateOfAdmission);
    const dischargeDate = new Date(admissionDate);
    dischargeDate.setDate(dischargeDate.getDate() + Math.round(days));
    dischargeDateStr = dischargeDate.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  // Clinical Stay Classification
  let categoryLabel = 'Standard Clinical Stay';
  let categoryClass = 'badge-moderate';
  let advisoryText = 'Standard bed turnover anticipated. Routine clinical care and discharge pathway advised.';

  if (days <= 7) {
    categoryLabel = 'Short Stay (Low Utilization)';
    categoryClass = 'badge-short';
    advisoryText = 'Rapid bed turnaround predicted. Early post-acute transition planning recommended.';
  } else if (days > 15) {
    categoryLabel = 'Extended Stay (High Bed Resource)';
    categoryClass = 'badge-extended';
    advisoryText = 'Higher likelihood of multi-week ward occupancy. Coordinate with discharge planning and ward logistics.';
  }

  return (
    <div className="prediction-result-card">
      <div className="result-header">
        <span className="result-eyebrow">Machine Learning Output</span>
        <h3 className="result-title">Projected Length of Stay</h3>
      </div>

      <div className="result-hero-box">
        <div className="hero-days-val">
          <span className="days-number">{days.toFixed(1)}</span>
          <span className="days-unit">Days</span>
        </div>
        <div className={`stay-category-badge ${categoryClass}`}>
          {categoryLabel}
        </div>
      </div>

      <div className="discharge-estimate-box">
        <div className="estimate-row">
          <Calendar size={16} className="estimate-icon" />
          <div className="estimate-details">
            <span className="estimate-label">Estimated Discharge Window:</span>
            <span className="estimate-date">{dischargeDateStr}</span>
          </div>
        </div>
        <div className="estimate-row">
          <Clock size={16} className="estimate-icon" />
          <div className="estimate-details">
            <span className="estimate-label">Admission Date:</span>
            <span className="estimate-val">{patientData?.dateOfAdmission || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="advisory-box">
        <div className="advisory-title">
          <AlertCircle size={15} /> Clinical Utilization Advisory
        </div>
        <p className="advisory-content">{advisoryText}</p>
      </div>

      <div className="meta-spec-table">
        <div className="spec-row">
          <span className="spec-label">Predictive Algorithm:</span>
          <span className="spec-val">{prediction.modelName || 'Random Forest Regressor'}</span>
        </div>
        <div className="spec-row">
          <span className="spec-label">Model Version:</span>
          <span className="spec-val">{prediction.modelVersion || '1.0.0'}</span>
        </div>
        <div className="spec-row">
          <span className="spec-label">Audit Log ID:</span>
          <span className="spec-val-mono">
            {prediction.historyId ? String(prediction.historyId).substring(0, 16) + '...' : 'Stateless Session'}
          </span>
        </div>
        <div className="spec-row">
          <span className="spec-label">Database Persistence:</span>
          <span className="spec-val">
            {prediction.persisted ? (
              <span className="persisted-yes">✓ Saved to MongoDB</span>
            ) : (
              <span className="persisted-no">Demo Mode</span>
            )}
          </span>
        </div>
      </div>

      <div className="result-actions">
        <button type="button" className="btn btn-secondary w-full" onClick={onReset}>
          <FileText size={15} /> Clear & Predict Another
        </button>
      </div>
    </div>
  );
}
