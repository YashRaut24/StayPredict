import axios from 'axios';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';

export const callMLServicePredict = async (patientData) => {
    // Normalize camelCase frontend payload to snake_case expected by FastAPI Pydantic schema
    const payload = {
        age: Number(patientData.age),
        gender: patientData.gender,
        blood_type: patientData.bloodType,
        medical_condition: patientData.medicalCondition,
        insurance_provider: patientData.insuranceProvider,
        admission_type: patientData.admissionType,
        date_of_admission: patientData.dateOfAdmission
    };

    try {
        const response = await axios.post(`${ML_SERVICE_URL}/predict`, payload, {
            timeout: 5000,
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            // FastAPI returned an explicit HTTP error (e.g. 422 validation failure)
            throw new Error(`ML Service Error (${error.response.status}): ${JSON.stringify(error.response.data.detail || error.response.data)}`);
        } else if (error.code === 'ECONNREFUSED') {
            throw new Error(`ML Service unavailable at ${ML_SERVICE_URL}. Is FastAPI running on port 8000?`);
        } else {
            throw new Error(`Communication failure with ML Service: ${error.message}`);
        }
    }
};

export const checkMLServiceHealth = async () => {
    try {
        const response = await axios.get(`${ML_SERVICE_URL}/health`, { timeout: 2000 });
        return response.data;
    } catch (error) {
        return { status: 'offline', error: error.message };
    }
};
