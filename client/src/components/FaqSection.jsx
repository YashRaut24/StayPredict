import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ShieldCheck, Cpu, Database, Stethoscope, Lock, HeartPulse } from 'lucide-react';
import './FaqSection.css';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: 'How does StayPredict prevent data leakage during admission-day predictions?',
      category: 'Clinical ML Integrity',
      icon: Cpu,
      answer:
        'StayPredict enforces strict temporal feature isolation. Only data documented strictly at or before admission triage (Age, Gender, Blood Type, Primary Medical Condition, Admission Urgency Type, and Payer Verification) is ingested. In-hospital treatment events, discharge medications, and post-admission clinical course data are strictly barred from the model input vector to ensure realistic pre-admission utility.',
    },
    {
      question: 'How is Protected Health Information (PHI) secured under HIPAA standards?',
      category: 'Data Privacy & Compliance',
      icon: Lock,
      answer:
        'The platform adheres to 45 CFR § 164.312 HIPAA Technical Safeguards. User authentication uses cryptographically salted bcrypt password hashing and tokenized JWT sessions with role-based access control (RBAC). The ML inference service operates statelessly without logging patient identifiers, and all data transmissions are secured via TLS 1.3.',
    },
    {
      question: 'What model architecture is utilized, and how is prolonged stay risk evaluated?',
      category: 'Machine Learning Specifications',
      icon: Database,
      answer:
        'The production engine is a 200-estimator Random Forest Regressor trained on 43,972 verified admissions with 10,994 unseen test samples (MAE 7.51 days). In addition to predicting expected stay days, the ensemble calculates an 80% confidence interval window and computes a Prolonged Stay Risk percentage (likelihood of hospitalization exceeding 14 days), alerting ward teams to plan post-acute placement early.',
    },
    {
      question: 'How do clinical teams use the What-If Acuity Simulator in practice?',
      category: 'Doctor & Staff Workflow',
      icon: Stethoscope,
      answer:
        'During morning multidisciplinary rounds, physicians can simulate clinical scenarios—such as shifting admission urgency from Elective to Emergency or switching medical management protocols. The simulator instantaneously outputs delta change in bed-days, allowing care teams to reserve step-down telemetry beds or initiate specialty consults in advance.',
    },
    {
      question: 'What information does the patient see in their personalized Recovery Portal?',
      category: 'Patient Empowerment',
      icon: HeartPulse,
      answer:
        'Registered patients and their authorized families access an easy-to-understand 4-Phase Recovery Roadmap (Clinical Stabilization, Mid-Stay Review, Discharge Clearance, and Home Release), target discharge date windows, tailored questions to ask their bedside clinician, and take-home medication checklists.',
    },
    {
      question: 'How does StayPredict integrate with enterprise EHR platforms (Epic, Cerner)?',
      category: 'Enterprise Interoperability',
      icon: ShieldCheck,
      answer:
        'StayPredict features standard HL7 FHIR (Fast Healthcare Interoperability Resources) compliant REST microservice interfaces. It seamlessly ingests ADT (Admission, Discharge, Transfer) feed messages via JSON endpoints and can be deployed on-premise in Kubernetes or containerized in HIPAA-compliant cloud VPCs.',
    },
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="faq-section-card">
      <div className="faq-header">
        <div className="faq-badge">
          <HelpCircle size={13} /> Institutional Knowledge Base & FAQ
        </div>
        <h2 className="faq-title">Frequently Asked Clinical & Technical Questions</h2>
        <p className="faq-subtitle">
          Transparent clinical rationale, HIPAA compliance standards, and architectural specifications for healthcare leaders.
        </p>
      </div>

      <div className="faq-list">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          const IconComp = faq.icon;
          return (
            <div key={idx} className={`faq-item ${isOpen ? 'open' : ''}`}>
              <button
                type="button"
                className="faq-question-btn"
                onClick={() => toggleFaq(idx)}
                aria-expanded={isOpen}
              >
                <div className="question-left">
                  <span className="faq-cat-badge">
                    <IconComp size={12} /> {faq.category}
                  </span>
                  <span className="question-text">{faq.question}</span>
                </div>
                <ChevronDown size={18} className={`chevron-icon ${isOpen ? 'rotated' : ''}`} />
              </button>

              {isOpen && (
                <div className="faq-answer-panel">
                  <p className="answer-text">{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
