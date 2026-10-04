import React from 'react';
import { Calendar, Clock, CheckCircle2, BedDouble, FileText, ClipboardList, ShieldAlert, HeartPulse } from 'lucide-react';
import './PredictionResult.css';

export default function PredictionResult({ prediction, patientData, onReset }) {
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
            <span>Target discharge date calculation</span>
          </div>
          <div className="guarantee-item">
            <CheckCircle2 size={15} className="guarantee-icon" />
            <span>Standardized clinical care pathways</span>
          </div>
        </div>
      </div>
    );
  }

  const days = Number(prediction.predictedStayDays);

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
  let dischargeMilestone = 'Day 10 - Multidisciplinary discharge review & pharmacy medication clearance.';

  if (days <= 7) {
    wardPlacement = 'Short-Stay Unit / Observation Ward (Tier 1)';
    categoryLabel = 'Short-Stay / Fast-Track';
    categoryClass = 'badge-short';
    staffingRatio = '1 Nurse : 5 Patients';
    dischargeMilestone = 'Day 3 - Early rehabilitation & outpatient transition review.';
  } else if (days > 15) {
    wardPlacement = 'Specialty Care / Long-Term Ward (Tier 3)';
    categoryLabel = 'Extended Inpatient Care';
    categoryClass = 'badge-extended';
    staffingRatio = '1 Nurse : 3 Patients';
    dischargeMilestone = 'Day 12 - Extended care coordination, family conference & post-acute facility prep.';
  }

  return (
    <div className="prediction-result-card">
      <div className="result-header">
        <span className="result-eyebrow">Inpatient Bed Planning</span>
        <h3 className="result-title">Projected Hospitalization Schedule</h3>
      </div>

      <div className="result-hero-box">
        <div className="hero-days-val">
          <span className="days-number">{days.toFixed(1)}</span>
          <span className="days-unit">Days Expected</span>
        </div>
        <div className={`stay-category-badge ${categoryClass}`}>
          {categoryLabel}
        </div>
      </div>

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

      {/* Ward & Care Management */}
      <div className="ward-allocation-box">
        <div className="ward-title">
          <BedDouble size={15} /> Recommended Bed Placement
        </div>
        <p className="ward-text">{wardPlacement}</p>
        <div className="ward-specs">
          <span className="ward-pill">Staffing: {staffingRatio}</span>
          <span className="ward-pill">Monitoring: Continuous Vitals</span>
        </div>
      </div>

      {/* Clinical Discharge Pathway */}
      <div className="pathway-box">
        <div className="pathway-title">
          <ClipboardList size={15} /> Key Discharge Milestone
        </div>
        <p className="pathway-text">{dischargeMilestone}</p>
      </div>

      <div className="patient-summary-table">
        <div className="summary-row">
          <span className="summary-label">Primary Diagnosis:</span>
          <span className="summary-val">{patientData?.medicalCondition || 'N/A'}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Admission Acuity:</span>
          <span className="summary-val">{patientData?.admissionType || 'N/A'}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Coverage / Payer:</span>
          <span className="summary-val">{patientData?.insuranceProvider || 'N/A'}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Census Status:</span>
          <span className="census-badge">
            <CheckCircle2 size={12} /> Logged in Active Inpatient Census
          </span>
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
