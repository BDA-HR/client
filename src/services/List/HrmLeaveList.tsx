import type { ListItem } from "../../types/List/list";
import { api } from "../api";

class HrmLeaveList {
    private namesUrl = `${import.meta.env.VITE_HRMM_LEAVE_URL || 'hrm/leave/v1'}/Names`;

    // GET: /api/hrm/leave/v1/Names/AllLeaveTypeName
    async getAllLeaveTypes(): Promise<ListItem[]> {
        try {
            const response = await api.get(`${this.namesUrl}/AllLeaveTypeName`);
            return response.data;
        } catch (error) {
            console.error('Error fetching education levels:', error);
            throw error;
        }
    }



}

export const hrmLeaveList = new HrmLeaveList();