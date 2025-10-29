import { api } from '../api';
import type { NameListItem } from '../../types/NameList/nameList';

class NameListService {
    private baseUrl = `${import.meta.env.VITE_HRMM_PROFILE_URL || "/hrm/profile/v1"}/Names`;

    // Address Name endpoints
    async getAllAddressNames(): Promise<NameListItem[]> {
        try {
            const response = await api.get(`${this.baseUrl}/AllAddressName`);
            return response.data;
        } catch (error) {
            console.error('Error fetching address names:', error);
            throw error;
        }
    }


}

export const nameListService = new NameListService();