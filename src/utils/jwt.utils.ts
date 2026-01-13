import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../types/auth/auth.types";

type PermissionType = "module" | "menu" | "api";

export function hasPermission(
    token: string,
    permission: string,
    type: PermissionType = "api"
): boolean {
    if (!token) return false;

    let payload: JwtPayload;
    try {
        payload = jwtDecode<JwtPayload>(token);
    } catch (e) {
        console.error("Invalid token", e);
        return false;
    }

    switch (type) {
        case "module":
            return payload.perModule.includes(permission);
        case "menu":
            return payload.perMenu.includes(permission);
        case "api":
        default:
            return payload.perApi.includes(permission);
    }
}

export function hasRole(token: string, expectedRole: string): boolean {
  if (!token) return false;

  try {
    const decoded: any = jwtDecode(token);
    return decoded.role === expectedRole;
  } catch (e) {
    console.error("Invalid token", e);
    return false;
  }
}