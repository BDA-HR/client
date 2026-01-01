import axios from 'axios';
import { isExpiringSoon } from '../auth/token.utils';
import { authStore } from '../auth/auth.store';

// Create axios instance with default config
export const api = axios.create({
  baseURL: import.meta.env.VITE_GATEWAY_URL || 'http://localhost:1212/',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* 🔐 Preemptive refresh */
api.interceptors.request.use(async config => {
  const state = authStore.getState();

  if (
    state.accessToken &&
    state.expiresAt &&
    isExpiringSoon(state.expiresAt)
  ) {
    await authStore.getState().refresh();
  }

  const token = authStore.getState().accessToken;
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