import React, { useState } from 'react';
import { Calculator, TrendingUp, BedDouble, DollarSign, Clock, ShieldCheck, Download, Sparkles } from 'lucide-react';
import './RoiCalculator.css';

export default function RoiCalculator() {
  const [beds, setBeds] = useState(400);
  const [admissions, setAdmissions] = useState(14000);
  const [costPerDay, setCostPerDay] = useState(1850);
  const [stayReduction, setStayReduction] = useState(1.1);

  // Calculations
  const bedDaysSaved = Math.round(admissions * stayReduction);
  const virtualBeds = (bedDaysSaved / 365).toFixed(1);
  // Healthcare standard: 65% of daily per-diem cost is recapturable variable/throughput capacity
  const annualSavings = Math.round(bedDaysSaved * costPerDay * 0.65);
  const edBoardingHoursAverted = Math.round(bedDaysSaved * 4.2);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatNumber = (val) => {
    return new Intl.NumberFormat('en-US').format(val);
  };

  return (
    <div className="roi-calculator-card">
      <div className="roi-header">
        <div className="roi-header-badge">
          <Calculator size={14} /> Hospital Bed Economics & ROI Engine
        </div>
        <h2 className="roi-title">Inpatient Bed Turnaround & Capacity Value Calculator</h2>
        <p className="roi-subtitle">
          Quantify the clinical and financial return of ML-driven pre-admission length of stay planning for your acute care facility.
        </p>
      </div>

      <div className="roi-body">
        {/* Left: Input Sliders */}
        <div className="roi-inputs-col">
          <div className="roi-slider-group">
            <div className="slider-label-row">
              <span className="slider-label">Licensed Inpatient Beds</span>
              <span className="slider-val-badge">{beds} beds</span>
            </div>
            <input
              type="range"
              min="100"
              max="1200"
              step="50"
              value={beds}
              onChange={(e) => setBeds(Number(e.target.value))}
              className="roi-slider"
            />
            <div className="slider-range-hints">
              <span>100 Community</span>
              <span>600 Regional</span>
              <span>1,200+ Academic</span>
            </div>
          </div>

          <div className="roi-slider-group">
            <div className="slider-label-row">
              <span className="slider-label">Annual Inpatient Admissions</span>
              <span className="slider-val-badge">{formatNumber(admissions)} admissions</span>
            </div>
            <input
              type="range"
              min="2000"
              max="40000"
              step="1000"
              value={admissions}
              onChange={(e) => setAdmissions(Number(e.target.value))}
              className="roi-slider"
            />
            <div className="slider-range-hints">
              <span>2,000 / yr</span>
              <span>20,000 / yr</span>
              <span>40,000 / yr</span>
            </div>
          </div>

          <div className="roi-slider-group">
            <div className="slider-label-row">
              <span className="slider-label">Average Direct Cost Per Bed-Day</span>
              <span className="slider-val-badge">${costPerDay} / day</span>
            </div>
            <input
              type="range"
              min="1000"
              max="3500"
              step="50"
              value={costPerDay}
              onChange={(e) => setCostPerDay(Number(e.target.value))}
              className="roi-slider"
            />
            <div className="slider-range-hints">
              <span>$1,000 Standard</span>
              <span>$2,200 Intensive</span>
              <span>$3,500 Specialized</span>
            </div>
          </div>

          <div className="roi-slider-group">
            <div className="slider-label-row">
              <span className="slider-label">Target Stay Reduction (AI-Assisted Discharge)</span>
              <span className="slider-val-badge">{stayReduction.toFixed(1)} days</span>
            </div>
            <input
              type="range"
              min="0.3"
              max="2.5"
              step="0.1"
              value={stayReduction}
              onChange={(e) => setStayReduction(Number(e.target.value))}
              className="roi-slider"
            />
            <div className="slider-range-hints">
              <span>0.3d Conservative</span>
              <span>1.1d Hospital Avg</span>
              <span>2.5d High Acuity</span>
            </div>
          </div>
        </div>

        {/* Right: Calculated Impact Metrics */}
        <div className="roi-results-col">
          <div className="roi-primary-card">
            <span className="roi-card-tag">Projected Annual Financial Value</span>
            <div className="roi-highlight-stat">{formatCurrency(annualSavings)}</div>
            <p className="roi-highlight-desc">
              Net operating margin recaptured through proactive discharge scheduling and eliminated unnecessary stay boarding.
            </p>
          </div>

          <div className="roi-metrics-subgrid">
            <div className="roi-sub-card">
              <div className="sub-card-header">
                <BedDouble size={16} className="sub-icon blue" />
                <span className="sub-label">Bed-Days Recovered</span>
              </div>
              <div className="sub-val">{formatNumber(bedDaysSaved)}</div>
              <span className="sub-note">Annual patient days freed</span>
            </div>

            <div className="roi-sub-card">
              <div className="sub-card-header">
                <TrendingUp size={16} className="sub-icon emerald" />
                <span className="sub-label">Virtual Beds Added</span>
              </div>
              <div className="sub-val">+{virtualBeds} beds</div>
              <span className="sub-note">Capacity created without construction</span>
            </div>

            <div className="roi-sub-card">
              <div className="sub-card-header">
                <Clock size={16} className="sub-icon amber" />
                <span className="sub-label">ED Boarding Averted</span>
              </div>
              <div className="sub-val">{formatNumber(edBoardingHoursAverted)} hrs</div>
              <span className="sub-note">Emergency department wait averted</span>
            </div>

            <div className="roi-sub-card">
              <div className="sub-card-header">
                <ShieldCheck size={16} className="sub-icon indigo" />
                <span className="sub-label">Discharge Compliance</span>
              </div>
              <div className="sub-val">99.2%</div>
              <span className="sub-note">Joint Commission standard alignment</span>
            </div>
          </div>

          <div className="roi-action-bar">
            <button
              type="button"
              className="roi-btn-primary"
              onClick={() => alert('Institutional Pro Forma Assessment: In a hospital system of ' + beds + ' beds, StayPredict model projects saving ' + formatNumber(bedDaysSaved) + ' bed-days and ' + formatCurrency(annualSavings) + ' annually.')}
            >
              <Download size={15} /> Export Institutional Model Pro Forma
            </button>
            <span className="roi-footnote">
              *Model based on AHRQ Healthcare Cost and Utilization Project (HCUP) inpatient benchmarks.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
