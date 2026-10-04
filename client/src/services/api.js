const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

/**
 * Helper to get authorization headers
 */
function getAuthHeaders() {
  const token = localStorage.getItem('staypredict_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Authentication: Login
 */
export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }
  return data;
}

/**
 * Authentication: Signup
 */
export async function signupUser(userData) {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }
  return data;
}

/**
 * Authentication: Fetch current user profile
 */
export async function fetchCurrentUser() {
  const token = localStorage.getItem('staypredict_token');
  if (!token) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) return null;
    return data.data;
  } catch (err) {
    return null;
  }
}

/**
 * Send pre-admission patient data to Express API Gateway
 */
export async function createPrediction(patientData) {
  const response = await fetch(`${API_BASE_URL}/predictions`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(patientData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to generate inpatient stay plan');
  }
  return data;
}

/**
 * Fetch historical predictions persisted in MongoDB
 */
export async function getPredictionHistory() {
  const response = await fetch(`${API_BASE_URL}/predictions`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch inpatient census records');
  }
  return data;
}

/**
 * Check health status of Express Gateway, MongoDB, and ML service
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
