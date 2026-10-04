const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Send pre-admission patient data to Express API Gateway
 * which relays to FastAPI ML service and saves to MongoDB.
 */
export async function createPrediction(patientData) {
  const response = await fetch(`${API_BASE_URL}/predictions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patientData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to generate prediction');
  }
  return data;
}

/**
 * Fetch historical predictions persisted in MongoDB
 */
export async function getPredictionHistory() {
  const response = await fetch(`${API_BASE_URL}/predictions`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch prediction history');
  }
  return data;
}

/**
 * Check health status of Express Gateway, MongoDB, and FastAPI ML microservice
 */
export async function getSystemHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      return {
        status: 'degraded',
        backend: 'error',
        database: 'unknown',
        mlService: { status: 'unreachable' },
      };
    }
    return await response.json();
  } catch (err) {
    return {
      status: 'offline',
      backend: 'offline',
      database: 'offline',
      mlService: { status: 'offline' },
    };
  }
}
