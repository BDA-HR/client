// import { create } from "zustand";
// import { loginApi, refreshTokenApi } from "../services/auth.api";
// import type { AuthTokens } from "../types/auth/auth.types";
// interface AuthState {
//     accessToken: string | null;
//     expiresAt: Date | null;
//     isAuthenticated: boolean;

//     login: (username: string, password: string) => Promise<void>;
//     refresh: () => Promise<void>;
//     logout: () => void;
// }

// export const authStore = create<AuthState>((set, get) => ({
//     accessToken: null,
//     expiresAt: null,
//     isAuthenticated: false,

//     async login(username, password) {
//         const tokens = await loginApi({ username, password });
//         setTokens(tokens, set);
//     },

//     async refresh() {
//         const tokens = await refreshTokenApi();
//         setTokens(tokens, set);
//     },

//     logout() {
//         set({
//             accessToken: null,
//             expiresAt: null,
//             isAuthenticated: false
//         });
//     }
// }));

// function setTokens(tokens: AuthTokens, set: any) {
//     set({
//         accessToken: tokens.accessToken,
//         expiresAt: new Date(tokens.expiresDate),
//         isAuthenticated: true
//     });
// }
