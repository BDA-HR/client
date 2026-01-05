import type { ListItem } from "../../types/List/list";
import { api } from "../api";

class ModPerMenuList {
    private namesUrl = `${import.meta.env.VITE_AUTH_MODULE_URL || 'auth/v1'}/Names`;

    // GET: /api/auth/v1/Names/AllPerMenuName
    async getAllPerMenuNames(): Promise<ListItem[]> {
        try {
            const response = await api.get(`${this.namesUrl}/AllPerMenuName`);
            return response.data;
        } catch (error) {
            console.error('Error fetching permission menu names:', error);
            throw error;
        }
    }

    // GET: /api/auth/v1/Names/GetPerMenuName/{id}
    async getPerMenuNameById(id: string): Promise<ListItem> {
        try {
            const response = await api.get(`${this.namesUrl}/GetPerMenuName/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching permission menu name by ID:', error);
            throw error;
        }
    }
}

export const modPerMenuList = new ModPerMenuList();