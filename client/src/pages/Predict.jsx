import React, { useState } from 'react';
import PatientForm from '../components/PatientForm';
import PredictionResult from '../components/PredictionResult';
import { createPrediction } from '../services/api';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import './Predict.css';

export default function Predict() {
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [apiError, setApiError] = useState('');
  const [successBanner, setSuccessBanner] = useState('');

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    setApiError('');
    setSuccessBanner('');
    try {
      const response = await createPrediction(formData);
      setPrediction(response.data);
      setPatientData(formData);
      setSuccessBanner('Patient successfully registered into active census. Expected stay schedule generated.');
    } catch (err) {
      setApiError(err.message || 'Unable to complete inpatient admission assessment.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulate = async (simulatedFormData) => {
    setIsLoading(true);
    setApiError('');
    try {
      const response = await createPrediction(simulatedFormData);
      setPrediction(response.data);
      setPatientData(simulatedFormData);
      setSuccessBanner(`Simulated stay adjustment for ${simulatedFormData.admissionType} admission acuity.`);
    } catch (err) {
      setApiError('Simulation error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPrediction(null);
    setPatientData(null);
    setApiError('');
    setSuccessBanner('');
  };

  return (
    <div className="predict-page">
      <div className="predict-header">
        <h1 className="predict-page-title">Patient Admission & Bed Planning Console</h1>
        <p className="predict-page-desc">
          Evaluate expected patient hospitalization days, assign appropriate ward care tiers, and initialize discharge milestones.
        </p>
      </div>

      {apiError && (
        <div className="predict-alert alert-error">
          <AlertCircle size={18} />
          <span>{apiError}</span>
        </div>
      )}

      {successBanner && (
        <div className="predict-alert alert-success">
          <CheckCircle2 size={18} />
          <span>{successBanner}</span>
        </div>
      )}

      <div className="predict-layout">
        <div className="predict-column-form">
          <PatientForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        </div>
        <div className="predict-column-result">
          <PredictionResult
            prediction={prediction}
            patientData={patientData}
            onReset={handleReset}
            onSimulate={handleSimulate}
          />
        </div>
      </div>
    </div>
  );
}
