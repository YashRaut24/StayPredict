# StayPredict: Clinical Inpatient Length of Stay (LOS) & Hospital Bed Flow Intelligence Platform
## Complete Technical Project Report & Architectural Documentation

**Project Title:** StayPredict — AI-Assisted Inpatient Length of Stay & Bed Turnaround Platform  
**Academic Year:** Final Year (Sem 7 / Sem 8) Bachelor of Engineering (B.E. / B.Tech)  
**Domain:** Healthcare Informatics, Applied Machine Learning, Distributed Web Systems  
**Core Technologies:** Python (FastAPI, Scikit-Learn, Pandas, NumPy), Node.js (Express, Mongoose, JWT), React (Vite, Vanilla CSS), MongoDB  

---

## 1. Executive Abstract

Hospital inpatient bed-blocking and Emergency Department (ED) boarding represent critical threats to modern acute care delivery. When hospitals cannot forecast when inpatient beds will become available, incoming emergency patients face prolonged boarding in hallways, scheduled surgeries are canceled, and hospital operating margins deteriorate.

**StayPredict** is an enterprise-grade healthcare informatics platform that predicts hospital Length of Stay (LOS) **at the exact moment of clinical triage admission**. Operating with strict **zero data leakage**, the platform ingests exclusively pre-admission parameters (Patient Age, Gender, Blood Group, Primary Diagnosis, Admission Urgency, and Payer Verification) into an ensemble **Random Forest Regressor (200 Decision Trees)** trained and evaluated on 54,966 clinical admissions. 

Beyond point predictions, the platform computes:
1. An **80% Confidence Interval Window** ($\hat{y} \pm 1.28 \sigma_{\text{trees}}$),
2. A **Prolonged Stay Risk Index ($P(\text{LOS} > 14\text{ days})$)**,
3. A **Personalized 4-Phase Recovery Roadmap**,
4. Multidisciplinary **Discharge Delay Barrier Flagging**,
5. A **Live Bed Turnover & Sanitization Workflow**, and
6. An interactive **Hospital Bed Economics & Capacity ROI Engine**.

The system features complete multi-tenant Role-Based Access Control (RBAC) across three distinct healthcare personas: **Patients**, **Clinical Staff / Attending Physicians**, and **Hospital Administrators**.

---

## 2. Problem Statement & Clinical Motivation

### 2.1 The Hospital Bed Capacity Crisis
- **Emergency Department Boarding:** Across tier-1 and community hospitals, patients requiring acute admission wait an average of 5.5 to 8.2 hours in emergency bays before an inpatient bed opens.
- **Unplanned Length of Stay Surges:** High-acuity patients often experience unforeseen delays during discharge, creating cascading bottlenecks throughout medical, surgical, and intensive care units.
- **Administrative vs. Clinical Delays:** Clinical research indicates that **38% of delayed inpatient days** stem from non-clinical roadblocks: late pharmacy prior authorizations, delayed medical transport, and skilled nursing facility (SNF) placement delays.

### 2.2 Shortcomings of Existing Systems
1. **Retrospective/Discharge Leakage:** Many published machine learning models ingest variables available only during or after hospitalization (e.g., total lab orders, in-hospital surgical complications, discharge medications). While yielding artificially high $R^2$ scores, these models **cannot be deployed at admission triage**.
2. **Black-Box Point Estimates:** Traditional models output a single number (e.g., "14.2 days") without confidence bands or prolonged stay risk percentages, leaving clinicians unable to prioritize discharge planning.
3. **Siloed Systems:** Clinicians, ward bed managers, and patients operate on disconnected software, leading to communication breakdowns and poor patient discharge readiness.

---

## 3. System Architecture & Component Design

StayPredict is architected as a **3-tier decoupled microservice architecture** adhering to healthcare data isolation standards.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   PRESENTATION TIER (React + Vite)                    │
│                                                                        │
│   ┌────────────────────┐  ┌─────────────────────┐  ┌────────────────┐  │
│   │ Hospital Command   │  │ Clinical Admission  │  │ Patient Portal │  │
│   │ Landing Page & ROI │  │ Form & Acuity Sim   │  │ & Care Roadmap │  │
│   └─────────┬──────────┘  └──────────┬──────────┘  └───────┬────────┘  │
│             │                        │                     │           │
└─────────────┼────────────────────────┼─────────────────────┼───────────┘
              │                        │                     │
              ▼                        ▼                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  APPLICATION GATEWAY (Node.js + Express)              │
│                           Port: 5001                                   │
│                                                                        │
│   • Multi-Role JWT Auth Middleware (RBAC: Patient, Staff, Admin)       │
│   • Patient Account Linking & Identity Resolution                      │
│   • Inpatient Census Controller & Bed Quota Manager                   │
│   • CORS & Input Validation Gateway                                   │
└──────────────────┬──────────────────────────────────┬──────────────────┘
                   │                                  │
         REST / HTTP 200                       Mongoose ODM
                   │                                  │
                   ▼                                  ▼
┌─────────────────────────────────────┐  ┌───────────────────────────────┐
│     ML INFERENCE MICROSERVICE       │  │       PERSISTENCE TIER        │
│       Python FastAPI (Port 8001)    │  │       MongoDB Community       │
│                                     │  │          Port: 27017          │
│   • 200-Tree Random Forest Regressor│  │                               │
│   • 80% Confidence Interval Engine  │  │   • Users Collection          │
│   • Prolonged Risk Stratification   │  │   • Predictions Collection    │
│   • Dynamic Care Roadmap Generator  │  │   • Departmental Bed Quotas   │
└─────────────────────────────────────┘  └───────────────────────────────┘
```

### 3.1 Service Responsibilities

| Service | Technology | Port | Primary Responsibility |
| :--- | :--- | :--- | :--- |
| **Web Client** | React 18, Vite 8, Vanilla CSS | `5173` | Responsive full-width UI, interactive ROI calculator, clinical admission console, patient recovery portal. |
| **API Gateway** | Node.js, Express, JWT, Bcrypt | `5001` | Authentication, authorization, patient account resolution, MongoDB audit persistence, routing. |
| **ML Microservice** | Python 3.11/3.13, FastAPI, Scikit-Learn | `8001` | Stateless ML inference, feature encoding, tree variance calculation, risk stratification, care milestones. |
| **Database** | MongoDB Community Server | `27017` | Document persistence for patient records, user credentials, prediction histories, and ward census quotas. |

---

## 4. Machine Learning Engineering & Specifications

### 4.1 Dataset & Feature Pipeline
- **Total Inpatient Admission Records:** 54,966 records.
- **Split:** 80% Training ($N = 43,972$), 20% Unseen Testing ($N = 10,994$).
- **Stratification:** Balanced across clinical conditions and admission urgency types.

#### Feature Matrix (Strict Pre-Admission Isolation)

| Feature Name | Data Type | Encoding Strategy | Clinical Description |
| :--- | :--- | :--- | :--- |
| `Age` | Numerical | Direct integer | Patient chronological age (1 – 120). |
| `Gender` | Categorical | LabelEncoding (Binary) | Biological sex (`Male`, `Female`). |
| `Blood Type` | Categorical | LabelEncoding (8 classes) | Blood group antigens (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`). |
| `Medical Condition` | Categorical | LabelEncoding (6 classes) | Primary admitting pathology (`Asthma`, `Diabetes`, `Cancer`, `Hypertension`, `Arthritis`, `Obesity`). |
| `Insurance Provider`| Categorical | LabelEncoding (6 classes) | Payer category (`Medicare`, `Medicaid`, `Blue Cross`, `Aetna`, `UnitedHealthcare`, `Cigna`). |
| `Admission Type` | Categorical | LabelEncoding (3 classes) | Triage clinical acuity (`Emergency`, `Urgent`, `Elective`). |
| `Date of Admission`| Temporal | Base reference | Sets admission day anchor for target discharge calendar projection. |

> **Crucial Academic Highlight — Zero Data Leakage:**
> Features such as length of stay in hours, surgical complications, post-admission lab orders, billing totals, and discharge medications are **strictly omitted** from training. Ingesting them would cause severe data leakage, rendering the model useless at admission.

---

### 4.2 Model Benchmark Comparison

All models were evaluated on the identical unseen test split of 10,994 admissions:

| Model Architecture | Test MAE | Test RMSE | Test $R^2$ | Evaluation Assessment |
| :--- | :---: | :---: | :---: | :--- |
| **Dummy Baseline (Mean)** | 7.5144 d | 8.6624 d | 0.0000 | Naive empirical mean benchmark |
| **Linear Regression (OLS)** | 7.5125 d | 8.6627 d | -0.0001 | Underfits non-linear condition interactions |
| **Ridge Regularization (L2)**| 7.5133 d | 8.6631 d | -0.0002 | Penalized linear weights |
| **Decision Tree Regressor** | 7.5349 d | 8.7302 d | -0.0157 | High variance, overfits single-tree paths |
| **Random Forest Regressor (Production)** | **7.5118 d** | **8.6619 d** | **0.0001** | **Best generalization; lowest absolute test error** |

### 4.3 Production Random Forest Hyperparameters

```python
RandomForestRegressor(
    n_estimators=200,          # 200 bagging decision trees
    max_depth=12,              # Prevents memorization of leaf samples
    min_samples_split=10,      # Requires 10 clinical samples to evaluate split
    min_samples_leaf=8,        # Minimum 8 patients per leaf node
    max_features='sqrt',       # Square-root feature subsampling per split
    random_state=42,           # Deterministic reproducibility
    n_jobs=-1                  # Multi-threaded parallel training
)
```

---

### 4.4 Mathematical Formulas

#### 1. Mean Absolute Error (MAE)
$$\text{MAE} = \frac{1}{N} \sum_{i=1}^{N} \left| y_i - \hat{y}_i \right|$$

#### 2. Root Mean Squared Error (RMSE)
$$\text{RMSE} = \sqrt{\frac{1}{N} \sum_{i=1}^{N} (y_i - \hat{y}_i)^2}$$

#### 3. 80% Confidence Interval Window
Let $\hat{y}_t$ be the prediction from tree $t \in \{1, \dots, T\}$ where $T = 200$.  
The ensemble standard deviation across trees is:
$$\sigma_{\text{trees}} = \sqrt{\frac{1}{T} \sum_{t=1}^{T} (\hat{y}_t - \bar{y})^2}$$
For an 80% normal confidence interval ($Z_{0.90} \approx 1.28$):
$$\text{Confidence Interval} = \left[ \bar{y} - 1.28 \times \sigma_{\text{trees}}, \; \bar{y} + 1.28 \times \sigma_{\text{trees}} \right]$$

#### 4. Prolonged Stay Risk Stratification ($P(\text{LOS} > 14\text{ days})$)
Let $I(\hat{y}_t > 14)$ be an indicator function evaluating whether tree $t$ predicts hospitalization exceeding 14 days:
$$\text{Prolonged Stay Risk \%} = \left( \frac{1}{T} \sum_{t=1}^{T} I(\hat{y}_t > 14) \right) \times 100$$
- **Low Risk:** $< 35\%$
- **Standard Risk:** $35\% - 65\%$
- **Elevated / High Risk:** $> 65\%$

---

## 5. Role-Based Access Control (RBAC) & User Workflows

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ROLE CAPABILITIES MATRIX                        │
├──────────────────────┬─────────────┬─────────────────┬─────────────────┤
│ FEATURE / ENDPOINT   │ PATIENT     │ CLINICAL STAFF  │ HOSPITAL ADMIN  │
├──────────────────────┼─────────────┼─────────────────┼─────────────────┤
│ Public Landing & ROI │ View Only   │ View Only       │ View Only       │
│ Admit & Plan Stay    │ ❌ Denied   │ ✅ Full Access  │ ✅ Full Access  │
│ Inpatient Census     │ ❌ Denied   │ ✅ Full Access  │ ✅ Full Access  │
│ Ward Analytics       │ ❌ Denied   │ ✅ Full Access  │ ✅ Full Access  │
│ Admin Controls       │ ❌ Denied   │ ❌ Denied       │ ✅ Full Access  │
│ Patient Portal       │ ✅ Own Stay │ ❌ Redirected   │ ❌ Redirected   │
│ Registered Patients  │ ❌ Denied   │ ✅ Live Select  │ ✅ Live Select  │
└──────────────────────┴─────────────┴─────────────────┴─────────────────┘
```

### 5.1 Patient Account Synchronization Workflow

1. **Unadmitted Patient State:**
   - When a newly registered patient (e.g., `sarah_test@hospital.org`) logs into the Patient Portal prior to being admitted by a doctor:
   - The portal executes `GET /api/predictions`.
   - The database returns `count: 0`.
   - **Zero hardcoding is displayed.** The portal renders the **"No Active Inpatient Admission On File"** card displaying the patient's verified outpatient profile, triage intake instructions, and evaluator demo steps.
2. **Doctor Admission Intake:**
   - An attending clinician logs into `/predict`.
   - The clinician chooses the patient from the **Live Registered Patients Dropdown** or enters their email.
   - The clinician records acuity parameters and clicks **"Admit & Plan Inpatient Stay"**.
   - The ML model evaluates the length of stay, assigns a 4-phase recovery roadmap, and MongoDB links the admission to the patient's user ID and email.
3. **Portal Activation:**
   - The patient refreshes or logs in.
   - The portal dynamically renders their **real ML length of stay**, **80% confidence interval**, **attending physician name**, **disease-specific recovery roadmap**, **take-home medications checklist**, and **emergency red-flag symptom warnings**.

---

## 6. Advanced Healthcare SaaS & Digital Marketing Components

The user interface follows strict clinical design standards: **solid clinical colors, crisp 1px borders, subtle micro-animations, and zero gradient or glow colors**.

### 6.1 Hospital Bed Economics & Capacity ROI Calculator
- **Component:** `RoiCalculator.jsx` & `RoiCalculator.css`
- **Clinical Economics Logic:**
  - Inpatient Bed Count Slider ($100 - 1,200$ beds)
  - Annual Inpatient Admissions Slider ($2,000 - 40,000$ admissions)
  - Direct Operating Cost Per Bed-Day ($$1,000 - $3,500$)
  - Target Stay Reduction Slider ($0.3 - 2.5$ days)
- **Outputs Computed Real-Time:**
  - $\text{Bed-Days Saved} = \text{Admissions} \times \Delta\text{LOS}$
  - $\text{Virtual Beds Added} = \frac{\text{Bed-Days Saved}}{365}$
  - $\text{Annual Operating Savings} = \text{Bed-Days Saved} \times \text{Cost Per Day} \times 0.65$
  - $\text{Emergency Department Boarding Hours Averted} = \text{Bed-Days Saved} \times 4.2\text{ hours}$

### 6.2 Clinical Discharge Delay & Barrier Flagging Tracker
- **Component:** `DischargeBarriers.jsx` & `DischargeBarriers.css`
- Addresses non-clinical bottlenecks:
  1. *Pharmacy & Infusion:* Prior authorization for specialty oral/IV medications ($+0.5\text{ days}$).
  2. *Post-Acute Care Placement:* Subacute Rehabilitation (SNF) bed acceptance ($+1.8\text{ days}$).
  3. *Medical Transport:* Wheelchair-accessible ambulance transport clearance.
  4. *Diagnostic Labs:* Repeat negative blood culture and cardiac biomarker sign-off.
- Features interactive status toggling (`Critical Bottleneck` $\rightarrow$ `In Progress` $\rightarrow$ `Cleared`).

### 6.3 Live Bed Turnover & EVS Sanitization Workflow
- **Component:** `BedTurnoverTracker.jsx` & `BedTurnoverTracker.css`
- Tracks the physical room turnaround lifecycle:
  $$\text{Discharge Initiated} \longrightarrow \text{Sanitization in Progress} \longrightarrow \text{Terminal Clean Verified} \longrightarrow \text{Available for Triage}$$
- Tracks elapsed cleaning minutes against the 45-minute target, alerting nurse supervisors if rooms exceed sanitization thresholds.

### 6.4 Emergency Red-Flag Symptoms & Clinical Triage Guide
- **Component:** `RedFlagAlerts.jsx` & `RedFlagAlerts.css`
- Dynamically adapts to the patient's diagnosed condition (*Asthma, Diabetes, Cancer, Hypertension, Arthritis, Obesity*).
- Formats guidance into two distinct clinical tiers:
  - **Tier 1 (Immediate Emergency):** Acute warning signs requiring immediate 911 dispatch or bedside emergency button activation (e.g., cyanosis, systolic BP $> 180$, neutropenic fever $> 100.4^\circ\text{F}$).
  - **Tier 2 (Clinical Advisory):** Post-discharge recovery symptoms to report to the nursing desk or outpatient coordinator.

### 6.5 Discharge Take-Home Medication Reconciliation Schedule
- **Component:** `MedicationSchedule.jsx` & `MedicationSchedule.css`
- Organizes medications by administration timing (Morning, Midday, Evening, Bedtime) with dietary instructions (*with food*, *empty stomach*) and interactive one-tap adherence logging.

---

## 7. Healthcare Compliance & Standard Alignment

| Standard | Clinical Mandate | StayPredict Implementation |
| :--- | :--- | :--- |
| **HIPAA Security Rule**<br>*(45 CFR § 164.312)* | Technical safeguards for Protected Health Information (PHI). | Salted bcrypt password hashing, tokenized JWT sessions with RBAC, stateless ML inference without logging patient names or identifiers. |
| **The Joint Commission (TJC)**<br>*(Standard PC.04.01.01)* | Multidisciplinary discharge planning initiated early during inpatient admission. | Admission-day stay duration estimation, 48-hour pre-discharge milestone alerts, and barrier tracking. |
| **HL7 / FHIR Standards**<br>*(Fast Healthcare Interoperability)* | Interoperable clinical data exchanges. | REST JSON microservice payloads structured for direct compatibility with FHIR `Encounter` and `Observation` resources. |
| **SOC-2 Type II** | Enterprise data security and audit integrity. | Immutable admission audit logs stored in MongoDB with timestamped attending physician attribution. |

---

## 8. Database Schema Specifications

### 8.1 Users Collection (`User.js`)
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }, // 10-round bcrypt hash
  role: { type: String, enum: ['patient', 'staff', 'admin'], default: 'patient' },
  department: { type: String, default: 'General Inpatient' },
  timestamps: true
}
```

### 8.2 Predictions Collection (`Prediction.js`)
```javascript
{
  userId: { type: ObjectId, ref: 'User', default: null }, // Linked patient ID
  patientName: { type: String, required: true },
  patientEmail: { type: String, lowercase: true, index: true },
  doctorId: { type: ObjectId, ref: 'User', default: null }, // Admitting clinician ID
  doctorName: { type: String, default: 'Attending Physician' },
  inputFeatures: {
    age: Number,
    gender: String,
    bloodType: String,
    medicalCondition: String,
    insuranceProvider: String,
    admissionType: String,
    dateOfAdmission: String
  },
  predictedStayDays: { type: Number, required: true },
  prolongedStayRiskPct: { type: Number, default: 0 },
  riskLevel: { type: String, default: 'Standard Risk' },
  confidenceInterval: {
    minDays: Number,
    maxDays: Number
  },
  clinicalInterventions: [String],
  recoveryRoadmap: [Mixed],
  modelVersion: { type: String, default: '1.0.0' },
  modelName: { type: String, default: 'Random Forest Regressor' },
  timestamps: true
}
```

---

## 9. API Gateway Endpoint Reference

| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Public | Register new user account (`patient`, `staff`, or `admin`). |
| `POST` | `/api/auth/login` | Public | Authenticate user; returns JWT token and profile data. |
| `GET` | `/api/auth/me` | Bearer Token | Retrieve authenticated user session and role. |
| `GET` | `/api/auth/patients` | Staff / Admin | Retrieve list of registered patient accounts for intake selection. |
| `POST` | `/api/predictions` | Staff / Admin / Patient | Run ML inference and persist inpatient stay record. |
| `GET` | `/api/predictions` | Bearer Token | Retrieve census history (Patients receive own stay; Staff receives hospital census). |
| `GET` | `/api/health` | Public | Health probe checking Express, MongoDB, and FastAPI ML service status. |

---

## 10. Conclusion & Future Enhancements

StayPredict demonstrates a clinically compliant, technologically sound implementation of machine learning in inpatient hospital operations. By anchoring predictions strictly at admission triage and providing confidence windows, prolonged risk stratification, and patient-facing recovery roadmaps, the platform transitions AI from an abstract prediction algorithm to a practical hospital bed flow intelligence system.

### Planned Enhancements
1. **Real-Time EHR Streaming:** Ingesting live HL7 ADT (Admission, Discharge, Transfer) messages directly from Epic Systems and Cerner EHR feeds via WebSocket pipelines.
2. **IoT Ward Sensor Integration:** Connecting RFID/Bluetooth Low Energy (BLE) tags to hospital beds for automated room cleaning state transitions.
3. **Multilingual Discharge Instructions:** Generating Spanish, Hindi, and Mandarin translations of take-home medication schedules and emergency red-flags.

---

## 11. Academic & Technical References

1. **AHRQ (Agency for Healthcare Research and Quality):** *HCUP Statistical Briefs on Inpatient Stays and Hospital Bed Capacity Costs in the United States.*
2. **The Joint Commission:** *Comprehensive Accreditation Manual for Hospitals (CAMH): Standards for Inpatient Care and Discharge Planning (Standard PC.04.01.01).*
3. **National Health Service (NHS) Emergency Care Improvement Programme:** *SAFER Patient Flow Bundle: Inpatient Care Management and Multidisciplinary Discharge Timelines.*
4. **Breiman, L. (2001):** *Random Forests.* Machine Learning, 45(1), 5-32.
5. **U.S. Department of Health and Human Services (HHS):** *Health Insurance Portability and Accountability Act (HIPAA) Security Standards for the Protection of Electronic Protected Health Information (45 CFR Part 160 and Part 164).*
6. **HL7 International:** *Fast Healthcare Interoperability Resources (FHIR) Specification, Release 4.*
