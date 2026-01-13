// src/services/auth.api.ts

import type { AuthTokens, LoginRequest } from "../types/auth/auth.types";
import { api } from "./api";
import axios from "axios"; // add this import

// Temporary direct axios instance for login only
const directAuthApi = axios.create({
  baseURL: "https://localhost:1213",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export const loginApi = async (payload: LoginRequest): Promise<AuthTokens> => {
  // Bypass gateway — call auth service directly (proven to work)
  const res = await directAuthApi.post("/api/auth/v1/Login", payload);

  if (!res.data.success) {
    throw new Error(res.data.message || "Login failed");
  }

  return res.data.data;
};

// Keep normal refresh through gateway (or direct if needed)
export const refreshTokenApi = async (): Promise<AuthTokens> => {
  const res = await api.post("/api/auth/v1/RefreshToken");
  if (!res.data.success) {
    throw new Error(res.data.message || "Refresh failed");
  }
  return res.data.data;
};
