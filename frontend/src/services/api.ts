import axios from 'axios';

// Base URL: prioritizes VITE_API_BASE_URL if explicitly provided, otherwise uses relative /api
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Response interceptor for clear error extraction
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorData = error.response?.data;
    const message = errorData?.error || errorData?.message || error.message || 'An unexpected API error occurred';
    return Promise.reject({
      message,
      statusCode: error.response?.status,
      details: errorData?.details,
    });
  }
);
