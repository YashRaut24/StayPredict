import React, { useState } from 'react';
import { BedDouble, ClipboardCheck, HeartPulse, ShieldCheck, Clock, Users, ChevronRight, Stethoscope } from 'lucide-react';
import './WardAnalytics.css';

export default function WardAnalytics() {
  const [activeTab, setActiveTab] = useState('wards');

  const wardsData = [
    { name: 'General Acute Medical Ward', capacity: 200, occupied: 168, avgStay: '12.4 Days', nurseRatio: '1 : 5', status: 'Moderate Demand' },
    { name: 'Intensive Care Unit (ICU)', capacity: 50, occupied: 46, avgStay: '6.8 Days', nurseRatio: '1 : 1', status: 'Near Capacity' },
    { name: 'Surgical Recovery Ward', capacity: 90, occupied: 72, avgStay: '8.5 Days', nurseRatio: '1 : 4', status: 'Operational' },
    { name: 'Oncology Care Pavilion', capacity: 100, occupied: 88, avgStay: '18.2 Days', nurseRatio: '1 : 3', status: 'High Occupancy' },
    { name: 'Emergency Short-Stay Bay', capacity: 60, occupied: 39, avgStay: '2.1 Days', nurseRatio: '1 : 4', status: 'Rapid Turnover' },
    { name: 'Pediatric Inpatient Unit', capacity: 50, occupied: 38, avgStay: '5.4 Days', nurseRatio: '1 : 4', status: 'Operational' },
  ];

  const clinicalPathways = [
    {
      condition: 'Asthma & Respiratory Distress',
      targetStay: '3 - 6 Days',
      ward: 'Acute Medical or Short-Stay',
      criteria: 'Peak expiratory flow >= 80% baseline, nebulizer weaned to MDI inhaler, oxygen saturation >= 95% on room air for 24 hours.',
      followUp: 'Outpatient pulmonology consultation at Day 7 post-discharge.',
    },
    {
      condition: 'Diabetes Complications / DKA',
      targetStay: '4 - 8 Days',
      ward: 'Acute Medical / Step-Down',
      criteria: 'Anion gap normalized, resolution of acidosis, fasting blood glucose 90-130 mg/dL on maintenance subcutaneous regimen.',
      followUp: 'Endocrinology clinic follow-up and diabetes nurse educator review.',
    },
    {
      condition: 'Hypertension & Cardiovascular Crisis',
      targetStay: '3 - 7 Days',
      ward: 'Telemetry / Acute Medical',
      criteria: 'Blood pressure stabilized < 140/90 mmHg on oral regimen for consecutive 48 hours without postural hypotension.',
      followUp: 'Cardiology clinic check-in with home ambulatory BP monitoring diary.',
    },
    {
      condition: 'Oncology / Cancer Inpatient Care',
      targetStay: '12 - 22 Days',
      ward: 'Oncology Care Pavilion',
      criteria: 'Chemotherapy/radiation cycle completed, absolute neutrophil count (ANC) >= 1500, pain managed on oral regimen, home care established.',
      followUp: 'Weekly medical oncology review and home palliative/supportive nursing.',
    },
    {
      condition: 'Arthritis & Orthopedic Care',
      targetStay: '5 - 10 Days',
      ward: 'Surgical Recovery / Rehab',
      criteria: 'Independent safe ambulation >= 50 meters with walking aid, surgical wound dry and intact, pain managed without IV opioids.',
      followUp: 'Outpatient physical therapy twice weekly starting Day 5 post-discharge.',
    },
    {
      condition: 'Obesity Complications Management',
      targetStay: '6 - 12 Days',
      ward: 'Acute Medical',
      criteria: 'Resolution of acute metabolic destabilization, CPAP/BiPAP compliance established, independent mobilization achieved.',
      followUp: 'Bariatric multidisciplinary follow-up and clinical dietitian consultation.',
    },
  ];

  const dischargePhases = [
    {
      phase: 'Phase 1: Admission & Triage',
      timeline: 'Hour 0 - 4',
      items: [
        'Calculate expected stay duration and target discharge date at intake',
        'Identify patient primary caregiver and discharge transport needs',
        'Verify payer/insurance authorization and coverage policies',
      ],
    },
    {
      phase: 'Phase 2: Mid-Stay Clinical Review',
      timeline: 'Day 3 - 5',
      items: [
        'Multidisciplinary team (MDT) review of patient clinical progress',
        'Review diagnostic milestones against expected length-of-stay target',
        'Engage hospital social work if home care assistance or rehab bed is needed',
      ],
    },
    {
      phase: 'Phase 3: Pre-Discharge Clearance',
      timeline: '48 Hours Prior to Discharge',
      items: [
        'Pharmacy medication reconciliation and dispensing of take-home prescriptions',
        'Patient and family discharge counseling and warning-sign education',
        'Confirm transport arrangements and outpatient appointment bookings',
      ],
    },
    {
      phase: 'Phase 4: Day of Discharge',
      timeline: 'Morning of Discharge',
      items: [
        'Final morning clinical rounds and attending physician discharge order',
        'Delivery of formal discharge summary to patient and primary physician',
        'Bed sanitation and turnover notification to central admissions desk',
      ],
    },
  ];

  return (
    <div className="ward-analytics-page">
      <div className="analytics-header">
        <h1 className="analytics-title">Ward Capacity & Clinical Care Pathways</h1>
        <p className="analytics-subtitle">
          Hospital-wide bed occupancy analytics, disease-specific discharge protocols, and patient transition milestones.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="tab-bar">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'wards' ? 'active' : ''}`}
          onClick={() => setActiveTab('wards')}
        >
          <BedDouble size={16} /> Department Bed Capacity
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'pathways' ? 'active' : ''}`}
          onClick={() => setActiveTab('pathways')}
        >
          <Stethoscope size={16} /> Clinical Care Pathways
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'protocols' ? 'active' : ''}`}
          onClick={() => setActiveTab('protocols')}
        >
          <ClipboardCheck size={16} /> Discharge Readiness Protocols
        </button>
      </div>

      {/* TAB 1: Ward Capacity */}
      {activeTab === 'wards' && (
        <section className="tab-content">
          <div className="table-card">
            <div className="card-top-row">
              <h2 className="card-heading">Hospital Service Ward Overview</h2>
              <span className="census-badge">Total Capacity: 550 Beds</span>
            </div>
            <div className="table-wrapper">
              <table className="analytics-table">
                <thead>
                  <tr>
                    <th>Department Ward</th>
                    <th>Bed Capacity</th>
                    <th>Current Occupancy</th>
                    <th>Average Patient Stay</th>
                    <th>Nurse-to-Patient Ratio</th>
                    <th>Operational Status</th>
                  </tr>
                </thead>
                <tbody>
                  {wardsData.map((ward, idx) => {
                    const pct = Math.round((ward.occupied / ward.capacity) * 100);
                    return (
                      <tr key={idx}>
                        <td className="font-semibold">{ward.name}</td>
                        <td>{ward.capacity} Beds</td>
                        <td>
                          <div className="occupancy-cell">
                            <span>{ward.occupied} ({pct}%)</span>
                            <div className="mini-progress-bar">
                              <div
                                className="mini-progress-fill"
                                style={{ width: `${pct}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="font-medium">{ward.avgStay}</td>
                        <td>{ward.nurseRatio}</td>
                        <td>
                          <span className={`status-pill status-${pct > 85 ? 'high' : 'normal'}`}>
                            {ward.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* TAB 2: Clinical Care Pathways */}
      {activeTab === 'pathways' && (
        <section className="tab-content">
          <div className="pathways-grid">
            {clinicalPathways.map((item, idx) => (
              <div key={idx} className="pathway-card">
                <div className="pathway-header">
                  <h3 className="pathway-name">{item.condition}</h3>
                  <span className="target-stay-pill">Target: {item.targetStay}</span>
                </div>
                <div className="pathway-body">
                  <div className="pathway-field">
                    <span className="field-label">Assigned Ward Level:</span>
                    <span className="field-value">{item.ward}</span>
                  </div>
                  <div className="pathway-field">
                    <span className="field-label">Medical Discharge Criteria:</span>
                    <p className="field-desc">{item.criteria}</p>
                  </div>
                  <div className="pathway-field">
                    <span className="field-label">Post-Discharge Transition:</span>
                    <p className="field-desc">{item.followUp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 3: Discharge Protocols */}
      {activeTab === 'protocols' && (
        <section className="tab-content">
          <div className="protocols-card">
            <h2 className="card-heading">4-Phase Inpatient Discharge Coordination Checklist</h2>
            <p className="protocols-desc">
              Standardized procedure followed by nursing supervisors, attending clinicians, and hospital care coordinators.
            </p>
            <div className="phases-list">
              {dischargePhases.map((phase, idx) => (
                <div key={idx} className="phase-block">
                  <div className="phase-header">
                    <div className="phase-number">{idx + 1}</div>
                    <div className="phase-title-wrap">
                      <h4 className="phase-name">{phase.phase}</h4>
                      <span className="phase-timeline">{phase.timeline}</span>
                    </div>
                  </div>
                  <ul className="phase-checklist">
                    {phase.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="checklist-item">
                        <ChevronRight size={14} className="check-icon" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
