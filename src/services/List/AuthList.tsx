import { api } from '../api';
import type { NameListItem, RoleListItem } from '../../types/NameList/nameList';

class NameListService {
    private baseUrl = `${import.meta.env.VITE_AUTH_URL || "/auth/v1"}/Names`;
    private perUrl = `${import.meta.env.VITE_AUTH_URL || "/auth/v1"}/Permission`;

    // GET: /api/auth/v1/Names/AllModuleName
    async getAllModuleNames(): Promise<NameListItem[]> {
        try {
            const response = await api.get(`${this.baseUrl}/AllModuleName`);
            return response.data;
        } catch (error) {
            console.error('Error fetching relations:', error);
            throw error;
        }
    }

    // GET: /api/auth/v1/Permission/AllRole
    async getAllRoles(): Promise<RoleListItem[]> {
        try {
            const response = await api.get(`${this.perUrl}/AllRole`);
            return response.data;
        } catch (error) {
            console.error('Error fetching relations:', error);
            throw error;
        }
    }

}

export const nameListService = new NameListService();