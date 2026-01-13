import axios from 'axios';
import { isExpiringSoon } from '../../src/utils/token.utils';
import { getAccessToken, getExpiresAt, refresh } from "../utils/auth.utils";

// Create axios instance with default config
export const api = axios.create({
  baseURL: import.meta.env.VITE_GATEWAY_URL || 'http://localhost:1212',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* 🔐 Preemptive refresh */
api.interceptors.request.use(async (config) => {
  let token = getAccessToken();
  const expiresAt = getExpiresAt();
  if (token && expiresAt && isExpiringSoon(expiresAt)) {
    await refresh();
    token = getAccessToken(); // Refresh updates cookie
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// Add request interceptor for auth tokens if needed
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      // localStorage.removeItem('authToken');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);