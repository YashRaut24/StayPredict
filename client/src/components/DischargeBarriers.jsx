import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, Pill, Building2, Truck, FileCheck, RefreshCw } from 'lucide-react';
import './DischargeBarriers.css';

export default function DischargeBarriers() {
  const [barriers, setBarriers] = useState([
    {
      id: 'b1',
      category: 'Pharmacy & Infusion',
      icon: Pill,
      title: 'Payer Prior Authorization for Specialty Inhaler / Antibiotic',
      owner: 'Inpatient Clinical Pharmacy',
      status: 'In Progress', // Cleared | In Progress | Critical Bottleneck
      riskImpact: '+0.5 Days',
      detail: 'Electronic prior authorization submitted to Aetna; awaiting formulary tier approval.',
    },
    {
      id: 'b2',
      category: 'Post-Acute Care Placement',
      icon: Building2,
      title: 'Subacute Rehabilitation (SNF) Bed Verification',
      owner: 'Medical Social Work & Case Mgmt',
      status: 'Critical Bottleneck',
      riskImpact: '+1.8 Days',
      detail: 'Patient referral transmitted to 3 regional facilities; awaiting bed availability confirmation.',
    },
    {
      id: 'b3',
      category: 'Medical Transport & Mobility',
      icon: Truck,
      title: 'Wheelchair-Accessible Medical Transport Scheduling',
      owner: 'Care Coordination Desk',
      status: 'Cleared',
      riskImpact: 'None',
      detail: 'Non-emergency transport scheduled for target discharge morning at 10:30 AM.',
    },
    {
      id: 'b4',
      category: 'Diagnostic & Lab Clearance',
      icon: FileCheck,
      title: 'Repeat Blood Culture & Cardiac Biomarker Sign-Off',
      owner: 'Attending Physician Service',
      status: 'Cleared',
      riskImpact: 'None',
      detail: 'Negative 48-hour culture verified; attending signed off morning lab panel.',
    },
  ]);

  const toggleStatus = (id) => {
    setBarriers((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        let nextStatus = 'In Progress';
        let nextImpact = '+0.5 Days';
        if (b.status === 'Critical Bottleneck') {
          nextStatus = 'In Progress';
          nextImpact = '+0.5 Days';
        } else if (b.status === 'In Progress') {
          nextStatus = 'Cleared';
          nextImpact = 'None';
        } else {
          nextStatus = 'Critical Bottleneck';
          nextImpact = '+1.5 Days';
        }
        return { ...b, status: nextStatus, riskImpact: nextImpact };
      })
    );
  };

  const criticalCount = barriers.filter((b) => b.status === 'Critical Bottleneck').length;
  const inProgressCount = barriers.filter((b) => b.status === 'In Progress').length;
  const clearedCount = barriers.filter((b) => b.status === 'Cleared').length;

  return (
    <div className="barriers-card">
      <div className="barriers-header">
        <div>
          <div className="barriers-badge">
            <AlertTriangle size={13} /> Multidisciplinary Discharge Tracker
          </div>
          <h3 className="barriers-title">Clinical Discharge Delay & Barrier Flagging</h3>
          <p className="barriers-subtitle">
            Proactively identifying logistical and clinical discharge roadblocks before they delay bed turnover.
          </p>
        </div>
        <div className="barriers-summary-pills">
          <span className="summary-pill red">{criticalCount} Bottlenecks</span>
          <span className="summary-pill amber">{inProgressCount} Pending</span>
          <span className="summary-pill green">{clearedCount} Cleared</span>
        </div>
      </div>

      <div className="barriers-table-wrapper">
        <table className="barriers-table">
          <thead>
            <tr>
              <th>Care Barrier Category</th>
              <th>Roadblock Description</th>
              <th>Responsible Team</th>
              <th>Discharge Delay Risk</th>
              <th>Resolution Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {barriers.map((b) => {
              const IconComp = b.icon;
              return (
                <tr key={b.id} className={`barrier-row ${b.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  <td>
                    <div className="barrier-category">
                      <IconComp size={15} className="cat-icon" />
                      <span>{b.category}</span>
                    </div>
                  </td>
                  <td>
                    <div className="barrier-desc-box">
                      <strong className="desc-title">{b.title}</strong>
                      <span className="desc-detail">{b.detail}</span>
                    </div>
                  </td>
                  <td>
                    <span className="barrier-owner">{b.owner}</span>
                  </td>
                  <td>
                    <span className={`barrier-impact ${b.riskImpact === 'None' ? 'cleared' : 'delayed'}`}>
                      {b.riskImpact}
                    </span>
                  </td>
                  <td>
                    <span className={`barrier-status-tag ${b.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="cycle-status-btn"
                      onClick={() => toggleStatus(b.id)}
                      title="Click to cycle status: Bottleneck -> In Progress -> Cleared"
                    >
                      <RefreshCw size={13} /> Update
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="barriers-footer">
        <span className="footer-note">
          *Research shows 38% of delayed hospital discharge days originate from administrative/placement delays rather than clinical instability.
        </span>
      </div>
    </div>
  );
}
