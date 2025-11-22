import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor - Add auth token to all requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('stockmaster_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('stockmaster_token');
          localStorage.removeItem('stockmaster_user');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden:', data.message);
          break;
        case 404:
          // Not found
          console.error('Resource not found:', data.message);
          break;
        case 500:
          // Server error
          console.error('Server error:', data.message);
          break;
        default:
          console.error('API Error:', data.message);
      }

      return Promise.reject(data);
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error: No response from server');
      return Promise.reject({
        success: false,
        message: 'Network error. Please check your connection.',
      });
    } else {
      // Something else happened
      console.error('Request error:', error.message);
      return Promise.reject({
        success: false,
        message: error.message,
      });
    }
  }
);

// Token management utilities
export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('stockmaster_token', token);
  } else {
    localStorage.removeItem('stockmaster_token');
  }
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('stockmaster_token');
};

export const setUserData = (user: any) => {
  localStorage.setItem('stockmaster_user', JSON.stringify(user));
};

export const getUserData = () => {
  const userData = localStorage.getItem('stockmaster_user');
  return userData ? JSON.parse(userData) : null;
};

export const clearAuthData = () => {
  localStorage.removeItem('stockmaster_token');
  localStorage.removeItem('stockmaster_user');
};

export default api;
