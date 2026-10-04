import React from 'react';
import { AlertOctagon, PhoneCall, Bell, ShieldAlert, HeartCrack, Thermometer, Activity } from 'lucide-react';
import './RedFlagAlerts.css';

export default function RedFlagAlerts({ condition = 'General Medical' }) {
  const redFlagsByCondition = {
    Asthma: {
      emergency: [
        'Extreme shortness of breath with inability to speak in full sentences',
        'Bluish or grayish lips, gums, or nail beds (cyanosis)',
        'Severe chest retractions (skin sucking in around ribs or neck during breathing)',
        'Peak flow meter reading in the Red Zone (< 50% personal best) failing to respond to rescue inhaler',
      ],
      advisory: [
        'Persistent nocturnal cough waking you up more than twice weekly',
        'Rescue inhaler needed more than 3 times in a single 24-hour period',
        'Mild wheezing or tight chest during light walking',
      ],
    },
    Diabetes: {
      emergency: [
        'Severe blood glucose elevation (> 350 mg/dL) with positive urine ketones',
        'Confusion, disorientation, extreme drowsiness, or slurred speech',
        'Fruity-smelling breath with rapid, deep breathing (Kussmaul breathing)',
        'Uncontrollable vomiting preventing oral hydration or insulin intake',
      ],
      advisory: [
        'Persistent fasting glucose above 200 mg/dL across two consecutive days',
        'New numbness, tingling, or non-healing blister on foot or toe',
        'Episodes of mild hypoglycemia (< 70 mg/dL) occurring mid-morning',
      ],
    },
    Cancer: {
      emergency: [
        'Oral temperature of 100.4°F (38.0°C) or higher (Neutropenic Fever alert)',
        'Sudden severe shaking chills or rigors',
        'Uncontrolled bleeding from gums, nose, or catheter insertion site',
        'Sudden acute shortness of breath or chest pain',
      ],
      advisory: [
        'Inability to tolerate fluids or food for longer than 24 hours',
        'Severe persistent diarrhea (> 4 episodes/day) despite anti-diarrheal meds',
        'New rash, redness, or tenderness around chemo port site',
      ],
    },
    Hypertension: {
      emergency: [
        'Blood pressure reading exceeding 180/120 mmHg (Hypertensive Crisis)',
        'Sudden severe headache accompanied by vision changes or numbness',
        'Acute chest pressure radiating to neck, jaw, or left arm',
        'Sudden weakness in face, arm, or leg (FAST stroke symptoms)',
      ],
      advisory: [
        'Systolic pressure consistently between 140–160 mmHg despite morning dose',
        'Mild postural dizziness when transitioning from lying to standing',
        'Mild ankle swelling by end of the day',
      ],
    },
    Arthritis: {
      emergency: [
        'Rapidly spreading redness, extreme heat, and severe pain in a joint with fever (Septic Arthritis)',
        'Inability to bear any weight on a joint after a sudden fall',
        'Sudden calf pain, tenderness, and warmth (Deep Vein Thrombosis suspicion)',
      ],
      advisory: [
        'Morning stiffness lasting longer than 60 minutes after awakening',
        'Mild increase in joint effusion (swelling) following physical therapy',
        'Stomach upset or dark stool while taking prescribed NSAIDs',
      ],
    },
    Obesity: {
      emergency: [
        'Sudden sharp chest pain or acute shortness of breath (Pulmonary Embolism suspicion)',
        'Severe persistent abdominal pain with elevated pulse (> 120 bpm)',
        'Unilateral leg swelling with severe calf tenderness',
      ],
      advisory: [
        'Difficulty tolerating recommended oral liquid stages',
        'Mild localized wound redness or dressing seepage',
        'Postural lightheadedness during ambulation',
      ],
    },
  };

  const currentWarnings = redFlagsByCondition[condition] || {
    emergency: [
      'Sudden severe chest pressure, tightness, or radiating pain',
      'Severe respiratory distress or acute shortness of breath at rest',
      'Sudden numbness or paralysis in face, arm, or leg',
      'Loss of consciousness or acute unresponsiveness',
    ],
    advisory: [
      'Fever above 101°F (38.3°C) lasting more than 24 hours',
      'Persistent nausea or vomiting preventing medication intake',
      'New or worsening pain not relieved by prescribed medications',
    ],
  };

  return (
    <div className="red-flags-card">
      <div className="red-flags-header">
        <div className="rf-badge">
          <AlertOctagon size={13} /> Clinical Safety & Triage Guide
        </div>
        <h3 className="rf-title">Emergency Red-Flag Symptoms for {condition}</h3>
        <p className="rf-subtitle">
          Critical symptoms that require immediate emergency triage versus conditions to discuss with your nursing team.
        </p>
      </div>

      <div className="rf-tiers-grid">
        {/* Tier 1: Emergency */}
        <div className="rf-tier-box tier-emergency">
          <div className="tier-header">
            <div className="tier-indicator red"></div>
            <div>
              <h4 className="tier-title red">Tier 1: Immediate Emergency Warning Signs</h4>
              <span className="tier-action red">Action: Press bedside emergency button or call 911 immediately</span>
            </div>
          </div>
          <ul className="tier-list">
            {currentWarnings.emergency.map((item, idx) => (
              <li key={idx} className="tier-list-item">
                <span className="item-bullet red">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tier 2: Advisory */}
        <div className="rf-tier-box tier-advisory">
          <div className="tier-header">
            <div className="tier-indicator amber"></div>
            <div>
              <h4 className="tier-title amber">Tier 2: Clinical Advisory & Nursing Notification</h4>
              <span className="tier-action amber">Action: Contact ward nursing desk or outpatient care coordinator</span>
            </div>
          </div>
          <ul className="tier-list">
            {currentWarnings.advisory.map((item, idx) => (
              <li key={idx} className="tier-list-item">
                <span className="item-bullet amber">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
