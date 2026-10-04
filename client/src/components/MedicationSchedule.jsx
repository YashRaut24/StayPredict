import React, { useState } from 'react';
import { Pill, Sun, Sunrise, Sunset, Moon, Check, AlertCircle, Info } from 'lucide-react';
import './MedicationSchedule.css';

export default function MedicationSchedule({ condition = 'General Medical' }) {
  const schedulesByCondition = {
    Asthma: [
      {
        id: 'm1',
        name: 'Budesonide / Formoterol (Symbicort)',
        dose: '160 / 4.5 mcg',
        timing: 'Morning & Evening',
        icon: Sunrise,
        instructions: '2 puffs twice daily; rinse mouth thoroughly with water after inhalation.',
        type: 'Controller',
        taken: false,
      },
      {
        id: 'm2',
        name: 'Albuterol Sulfate (Ventolin HFA)',
        dose: '90 mcg / actuation',
        timing: 'As Needed (PRN)',
        icon: Sun,
        instructions: '1-2 puffs every 4-6 hours for acute wheeze or shortness of breath.',
        type: 'Rescue',
        taken: false,
      },
      {
        id: 'm3',
        name: 'Prednisone Oral Taper',
        dose: '20 mg',
        timing: 'Morning with Breakfast',
        icon: Sunrise,
        instructions: 'Take 1 tablet daily with food for 5 days post-discharge. Do not skip.',
        type: 'Anti-Inflammatory',
        taken: true,
      },
    ],
    Diabetes: [
      {
        id: 'm1',
        name: 'Metformin Hydrochloride',
        dose: '850 mg',
        timing: 'Morning & Evening Meals',
        icon: Sun,
        instructions: 'Take immediately with meals to minimize gastrointestinal discomfort.',
        type: 'Sensitizer',
        taken: true,
      },
      {
        id: 'm2',
        name: 'Insulin Glargine (Basaglar)',
        dose: '18 Units SubQ',
        timing: 'Bedtime (9:00 PM)',
        icon: Moon,
        instructions: 'Inject subcutaneously in abdomen; rotate injection sites nightly.',
        type: 'Basal Insulin',
        taken: false,
      },
      {
        id: 'm3',
        name: 'Empagliflozin (Jardiance)',
        dose: '10 mg',
        timing: 'Morning',
        icon: Sunrise,
        instructions: 'Take in the morning with a full glass of water. Maintain hydration.',
        type: 'SGLT2 Inhibitor',
        taken: false,
      },
    ],
    Hypertension: [
      {
        id: 'm1',
        name: 'Lisinopril',
        dose: '20 mg',
        timing: 'Morning',
        icon: Sunrise,
        instructions: 'Take every morning at approximately the same time. Monitor BP.',
        type: 'ACE Inhibitor',
        taken: true,
      },
      {
        id: 'm2',
        name: 'Amlodipine Besylate',
        dose: '5 mg',
        timing: 'Evening',
        icon: Sunset,
        instructions: 'May be taken with or without food. Check ankles for mild swelling.',
        type: 'Calcium Blocker',
        taken: false,
      },
    ],
    Arthritis: [
      {
        id: 'm1',
        name: 'Meloxicam',
        dose: '15 mg',
        timing: 'Morning with Food',
        icon: Sunrise,
        instructions: 'Always take with food or milk to protect stomach lining.',
        type: 'NSAID',
        taken: true,
      },
      {
        id: 'm2',
        name: 'Acetaminophen (Tylenol ER)',
        dose: '650 mg',
        timing: 'Every 8 Hours PRN',
        icon: Sun,
        instructions: 'Do not exceed 3,000 mg in 24 hours. Check other meds for acetaminophen.',
        type: 'Analgesic',
        taken: false,
      },
    ],
  };

  const defaultMeds = [
    {
      id: 'm1',
      name: 'Pantoprazole Sodium',
      dose: '40 mg',
      timing: 'Morning 30 mins before food',
      icon: Sunrise,
      instructions: 'Swallow tablet whole with water 30 minutes before morning meal.',
      type: 'GI Protection',
      taken: true,
    },
    {
      id: 'm2',
      name: 'Prescribed Outpatient Antibiotic',
      dose: 'As instructed on label',
      timing: 'Twice daily',
      icon: Sun,
      instructions: 'Complete full prescribed course even if symptoms have resolved.',
      type: 'Antibiotic',
      taken: false,
    },
  ];

  const initialList = schedulesByCondition[condition] || defaultMeds;
  const [meds, setMeds] = useState(initialList);

  const toggleTaken = (id) => {
    setMeds((prev) =>
      prev.map((med) => (med.id === id ? { ...med, taken: !med.taken } : med))
    );
  };

  return (
    <div className="med-schedule-card">
      <div className="med-header">
        <div>
          <div className="med-badge">
            <Pill size={13} /> Discharge Pharmacy Reconciliation
          </div>
          <h3 className="med-title">Take-Home Medication & Administration Schedule</h3>
          <p className="med-subtitle">
            Personalized prescription instructions verified by the hospital pharmacy team before discharge.
          </p>
        </div>
      </div>

      <div className="med-list">
        {meds.map((med) => {
          const TimingIcon = med.icon;
          return (
            <div
              key={med.id}
              className={`med-item ${med.taken ? 'med-taken' : ''}`}
              onClick={() => toggleTaken(med.id)}
            >
              <div className="med-checkbox-col">
                <div className={`med-check-circle ${med.taken ? 'checked' : ''}`}>
                  {med.taken && <Check size={13} />}
                </div>
              </div>

              <div className="med-info-col">
                <div className="med-name-row">
                  <span className="med-name">{med.name}</span>
                  <span className="med-dose-pill">{med.dose}</span>
                  <span className="med-type-tag">{med.type}</span>
                </div>
                <div className="med-timing-row">
                  <TimingIcon size={14} className="timing-icon" />
                  <span className="timing-text">{med.timing}</span>
                </div>
                <p className="med-instructions">{med.instructions}</p>
              </div>

              <div className="med-status-col">
                <span className={`med-status-label ${med.taken ? 'taken' : 'pending'}`}>
                  {med.taken ? 'Logged Taken' : 'Tap to Confirm'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="med-footer">
        <Info size={14} className="footer-icon" />
        <span>
          Do not alter dosages or stop medications without consulting your primary care provider or ward pharmacist.
        </span>
      </div>
    </div>
  );
}
