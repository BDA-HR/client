import type { EmployeeListDto, UUID } from "../../../types/hr/employee";
import { api } from "../../api";

class EmployeeService {
    private baseUrl = `${import.meta.env.VITE_HRMM_PROFILE_URL || "/hrm/profile/v1"}/Employee`;
    //   private braUrl = `${import.meta.env.VITE_CORE_MODULE_URL || 'core/module/v1'}/Names`;

    // GET: /api/hrm/profile/v1/Employee/AllEmployee
    async getAllEmployees(): Promise<EmployeeListDto[]> {
        try {
            const response = await api.get(`${this.baseUrl}/AllEmployee`);
            return response.data;
        } catch (error) {
            console.error('Error fetching branches:', error);
            throw error;
        }
    }

    // DELETE: /api/hrm/profile/v1/Employee/DelEmployee/{id}
    async deleteEmployee(id: UUID): Promise<void> {
        try {
            await api.delete(`${this.baseUrl}/DelEmployee/${id}`);
        } catch (error) {
            console.error('Error deleting branch:', error);
            throw error;
        }
    }

}

export const employeeService = new EmployeeService();
