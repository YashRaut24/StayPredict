import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle2, BedDouble, FileText, ClipboardList, ShieldAlert, HeartPulse, AlertTriangle, Sliders, ArrowRight } from 'lucide-react';
import './PredictionResult.css';

export default function PredictionResult({ prediction, patientData, onReset, onSimulate }) {
  const [simulatedAcuity, setSimulatedAcuity] = useState(patientData?.admissionType || 'Emergency');

  if (!prediction) {
    return (
      <div className="result-placeholder-card">
        <div className="placeholder-icon-wrap">
          <BedDouble size={36} className="placeholder-icon" />
        </div>
        <h3 className="placeholder-title">Awaiting Patient Admission Data</h3>
        <p className="placeholder-desc">
          Submit the patient's admission profile to generate expected inpatient duration, ward assignment recommendations, and discharge milestones.
        </p>
        <div className="model-guarantee-box">
          <div className="guarantee-item">
            <CheckCircle2 size={15} className="guarantee-icon" />
            <span>Automatic bed availability projection</span>
          </div>
          <div className="guarantee-item">
            <CheckCircle2 size={15} className="guarantee-icon" />
            <span>Prolonged stay risk stratification</span>
          </div>
          <div className="guarantee-item">
            <CheckCircle2 size={15} className="guarantee-icon" />
            <span>Clinical intervention recommendations</span>
          </div>
        </div>
      </div>
    );
  }

  const days = Number(prediction.predictedStayDays);
  const prolongedRisk = prediction.prolongedStayRiskPct || 0;
  const riskLevel = prediction.riskLevel || 'Standard Risk';
  const confidence = prediction.confidenceInterval || { min_days: days, max_days: days };
  const interventions = prediction.clinicalInterventions || [];

  // Compute Estimated Discharge Date
  let dischargeDateStr = 'Pending admission date';
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

  // Clinical Stay Classification & Ward Recommendations
  let wardPlacement = 'Standard Acute Medical Ward (Tier 2)';
  let categoryLabel = 'Standard Inpatient Stay';
  let categoryClass = 'badge-moderate';
  let staffingRatio = '1 Nurse : 4 Patients';

  if (days <= 7) {
    wardPlacement = 'Short-Stay Unit / Observation Ward (Tier 1)';
    categoryLabel = 'Short-Stay / Fast-Track';
    categoryClass = 'badge-short';
    staffingRatio = '1 Nurse : 5 Patients';
  } else if (days > 15) {
    wardPlacement = 'Specialty Care / Long-Term Ward (Tier 3)';
    categoryLabel = 'Extended Inpatient Care';
    categoryClass = 'badge-extended';
    staffingRatio = '1 Nurse : 3 Patients';
  }

  const isHighRisk = prolongedRisk >= 65;
  const isModerateRisk = prolongedRisk >= 40 && prolongedRisk < 65;

  return (
    <div className="prediction-result-card">
      <div className="result-header">
        <span className="result-eyebrow">Clinical Decision Support</span>
        <h3 className="result-title">Projected Inpatient Schedule & Risk</h3>
      </div>

      {/* Hero Prediction & Confidence Window */}
      <div className="result-hero-box">
        <div className="hero-days-val">
          <span className="days-number">{days.toFixed(1)}</span>
          <span className="days-unit">Days Expected</span>
        </div>
        <div className="hero-sub-stats">
          <span className={`stay-category-badge ${categoryClass}`}>
            {categoryLabel}
          </span>
          <span className="confidence-pill">
            80% Range: {confidence.min_days} - {confidence.max_days} days
          </span>
        </div>
      </div>

      {/* Prolonged Stay Risk Assessment */}
      <div className={`risk-strat-box ${isHighRisk ? 'risk-high' : isModerateRisk ? 'risk-moderate' : 'risk-low'}`}>
        <div className="risk-header-row">
          <div className="risk-title-wrap">
            <AlertTriangle size={16} />
            <span className="risk-title">Prolonged Stay Risk Index:</span>
          </div>
          <span className="risk-pct-val">{prolongedRisk}%</span>
        </div>
        <div className="risk-bar-track">
          <div className="risk-bar-fill" style={{ width: `${Math.min(100, prolongedRisk)}%` }}></div>
        </div>
        <span className="risk-desc">
          {riskLevel} — {isHighRisk ? 'High probability of multi-week ward occupancy and post-acute delay.' : 'Standard turnaround anticipated.'}
        </span>
      </div>

      {/* Target Discharge Window */}
      <div className="discharge-estimate-box">
        <div className="estimate-row">
          <Calendar size={16} className="estimate-icon" />
          <div className="estimate-details">
            <span className="estimate-label">Target Discharge Date:</span>
            <span className="estimate-date">{dischargeDateStr}</span>
          </div>
        </div>
        <div className="estimate-row">
          <Clock size={16} className="estimate-icon" />
          <div className="estimate-details">
            <span className="estimate-label">Admission Timestamp:</span>
            <span className="estimate-val">{patientData?.dateOfAdmission || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Ward Placement */}
      <div className="ward-allocation-box">
        <div className="ward-title">
          <BedDouble size={15} /> Recommended Bed Placement
        </div>
        <p className="ward-text">{wardPlacement}</p>
        <div className="ward-specs">
          <span className="ward-pill">Staffing: {staffingRatio}</span>
          <span className="ward-pill">Monitoring: Continuous Telemetry</span>
        </div>
      </div>

      {/* Actionable Clinical Interventions for Clinicians */}
      {interventions.length > 0 && (
        <div className="interventions-box">
          <div className="interventions-title">
            <ClipboardList size={15} /> Clinical Interventions for Care Team
          </div>
          <ul className="interventions-list">
            {interventions.map((item, idx) => (
              <li key={idx} className="intervention-item">
                <span className="bullet-dot"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Interactive What-If Scenario Simulator for Doctors */}
      <div className="what-if-simulator-card">
        <div className="simulator-header">
          <Sliders size={15} />
          <span className="simulator-title">Clinician "What-If" Acuity Simulator</span>
        </div>
        <p className="simulator-desc">
          Test clinical impact on length of stay if patient triage urgency is adjusted:
        </p>
        <div className="simulator-buttons">
          {['Emergency', 'Urgent', 'Elective'].map((type) => (
            <button
              key={type}
              type="button"
              className={`sim-btn ${patientData?.admissionType === type ? 'active' : ''}`}
              onClick={() => onSimulate && onSimulate({ ...patientData, admissionType: type })}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="result-actions">
        <button type="button" className="btn btn-secondary w-full" onClick={onReset}>
          <FileText size={15} /> Clear & Admit Next Patient
        </button>
      </div>
    </div>
  );
}
