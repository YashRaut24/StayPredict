import React from 'react';
import { ShieldCheck, HeartPulse, Building2 } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-info">
          <p className="footer-text">
            <strong>StayPredict Health</strong> — Hospital Inpatient Length of Stay & Bed Resource Planning System.
          </p>
          <p className="footer-subtext">
            Assisting admissions coordinators, head nurses, and department administrators with proactive bed allocation and discharge planning.
          </p>
        </div>
        <div className="footer-meta">
          <span className="footer-tag">
            <ShieldCheck size={13} className="meta-icon" /> Clinical Protocol Verified
          </span>
          <span className="footer-tag">
            <HeartPulse size={13} className="meta-icon" /> Active Inpatient Census
          </span>
          <span className="footer-tag">
            <Building2 size={13} className="meta-icon" /> Central Bed Management
          </span>
        </div>
      </div>
    </footer>
  );
}
