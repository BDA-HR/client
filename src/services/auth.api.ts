import type { ApiResponse, AuthTokens, LoginRequest } from "../auth/auth.types";
import { api } from './api';

const AUTH_URL = `${import.meta.env.VITE_AUTH_URL || 'auth/v1'}`;

export const loginApi = async (payload: LoginRequest): Promise<AuthTokens> => {
    const res = await api.post<ApiResponse<AuthTokens>>(`${AUTH_URL}/Login`, payload);

    if (!res.data.success) {
        throw new Error(res.data.message);
    }

    return res.data.data;
};

export const refreshTokenApi = async (): Promise<AuthTokens> => {
    const res = await api.post<ApiResponse<AuthTokens>>(`${AUTH_URL}/RefreshToken`);

    if (!res.data.success) {
        throw new Error("Refresh token expired");
    }

    return res.data.data;
};
