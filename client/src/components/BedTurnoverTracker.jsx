import React, { useState } from 'react';
import { Sparkles, BedDouble, CheckCircle2, Clock, AlertCircle, RefreshCw, UserCheck } from 'lucide-react';
import './BedTurnoverTracker.css';

export default function BedTurnoverTracker() {
  const [beds, setBeds] = useState([
    {
      id: 'B-301',
      unit: 'Acute Medical Ward',
      stage: 'Sanitization in Progress', // Discharge Initiated | Sanitization in Progress | Terminal Clean Verified | Available
      assignedEVS: 'Team Alpha (P. Ramos)',
      elapsedMins: 28,
      targetMins: 45,
      urgency: 'High (ED Boarding)',
    },
    {
      id: 'ICU-08',
      unit: 'Intensive Care Unit',
      stage: 'Terminal Clean Verified',
      assignedEVS: 'Specialized Bio-Clean (D. Chen)',
      elapsedMins: 52,
      targetMins: 60,
      urgency: 'Critical Priority',
    },
    {
      id: 'B-412',
      unit: 'Surgical & Post-Op',
      stage: 'Discharge Initiated',
      assignedEVS: 'Awaiting EVS Dispatch',
      elapsedMins: 10,
      targetMins: 45,
      urgency: 'Standard',
    },
    {
      id: 'B-205',
      unit: 'Oncology Service',
      stage: 'Available for Triage',
      assignedEVS: 'Inspected by Charge RN',
      elapsedMins: 0,
      targetMins: 0,
      urgency: 'Ready for Admission',
    },
  ]);

  const advanceStage = (id) => {
    setBeds((prev) =>
      prev.map((bed) => {
        if (bed.id !== id) return bed;
        if (bed.stage === 'Discharge Initiated') {
          return { ...bed, stage: 'Sanitization in Progress', assignedEVS: 'Team Beta Dispatched', elapsedMins: 15 };
        } else if (bed.stage === 'Sanitization in Progress') {
          return { ...bed, stage: 'Terminal Clean Verified', assignedEVS: 'Supervised by EVS Lead', elapsedMins: 40 };
        } else if (bed.stage === 'Terminal Clean Verified') {
          return { ...bed, stage: 'Available for Triage', assignedEVS: 'Inspected & Released', elapsedMins: 0, urgency: 'Ready for Admission' };
        } else {
          return { ...bed, stage: 'Discharge Initiated', assignedEVS: 'Awaiting EVS Dispatch', elapsedMins: 5, urgency: 'High (ED Boarding)' };
        }
      })
    );
  };

  const getStageClass = (stage) => {
    switch (stage) {
      case 'Available for Triage':
        return 'stage-available';
      case 'Terminal Clean Verified':
        return 'stage-verified';
      case 'Sanitization in Progress':
        return 'stage-sanitizing';
      default:
        return 'stage-initiated';
    }
  };

  return (
    <div className="bed-turnover-card">
      <div className="turnover-header">
        <div>
          <div className="turnover-badge">
            <Sparkles size={13} /> Hospital Operations & Bed Hygiene
          </div>
          <h3 className="turnover-title">Live Bed Turnover & EVS Sanitization Workflow</h3>
          <p className="turnover-subtitle">
            Accelerating post-discharge room turnover to prevent emergency department boarding and bed-block bottlenecks.
          </p>
        </div>
        <div className="turnover-kpi-box">
          <span className="kpi-label">Average Bed Turnaround Time</span>
          <span className="kpi-val">38.4 <span className="kpi-unit">mins</span></span>
          <span className="kpi-note">Target: &lt; 45 mins</span>
        </div>
      </div>

      <div className="turnover-grid">
        {beds.map((bed) => {
          const isOverdue = bed.elapsedMins > bed.targetMins && bed.targetMins > 0;
          return (
            <div key={bed.id} className={`turnover-item ${getStageClass(bed.stage)}`}>
              <div className="item-top">
                <div>
                  <span className="bed-number">{bed.id}</span>
                  <span className="bed-unit">{bed.unit}</span>
                </div>
                <span className={`bed-urgency-tag ${bed.urgency.toLowerCase().includes('critical') || bed.urgency.toLowerCase().includes('high') ? 'urgent' : ''}`}>
                  {bed.urgency}
                </span>
              </div>

              <div className="item-stage-row">
                <span className={`stage-pill ${getStageClass(bed.stage)}`}>
                  {bed.stage}
                </span>
              </div>

              {bed.targetMins > 0 && (
                <div className="turnover-progress">
                  <div className="progress-labels">
                    <span>Cleaning Elapsed</span>
                    <span className={isOverdue ? 'overdue-text' : ''}>
                      {bed.elapsedMins} / {bed.targetMins} min
                    </span>
                  </div>
                  <div className="turnover-bar">
                    <div
                      className={`turnover-fill ${isOverdue ? 'fill-overdue' : ''}`}
                      style={{ width: `${Math.min(100, Math.round((bed.elapsedMins / bed.targetMins) * 100))}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="item-footer">
                <span className="evs-staff">{bed.assignedEVS}</span>
                <button
                  type="button"
                  className="stage-advance-btn"
                  onClick={() => advanceStage(bed.id)}
                  title="Advance turnover stage"
                >
                  <RefreshCw size={12} /> Progress State
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
