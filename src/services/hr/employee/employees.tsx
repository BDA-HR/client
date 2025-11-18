import type { EmployeeListDto, UUID } from "../../../types/hr/employee";
import { api } from "../../api";

class EmployeeService {
    private baseUrl = `${import.meta.env.VITE_HRMM_PROFILE_URL || "/hrm/profile/v1"}/Employee`;

    // Helper method to extract error messages
    private extractErrorMessage(error: any): string {
        if (error.response?.data?.message) {
            return error.response.data.message;
        }
        if (error.response?.data?.errors) {
            // Handle validation errors (object with field names as keys)
            const errors = error.response.data.errors;
            const errorMessages = Object.values(errors).flat();
            return errorMessages.join(', ');
        }
        if (error.message) {
            return error.message;
        }
        return 'An unexpected error occurred';
    }

    // GET: /api/hrm/profile/v1/Employee/AllEmployee
    async getAllEmployees(): Promise<EmployeeListDto[]> {
        try {
            const response = await api.get(`${this.baseUrl}/AllEmployee`);
            return response.data.data;
        } catch (error) {
            const errorMessage = this.extractErrorMessage(error);
            console.error('Error fetching employees:', errorMessage);
            throw new Error(errorMessage);
        }
    }

    // DELETE: /api/hrm/profile/v1/Employee/DelEmployee/{id}
    async deleteEmployee(id: UUID): Promise<void> {
        try {
            const response = await api.delete(`${this.baseUrl}/DelEmployee/${id}`);
            console.info('Employee deleted successfully:', response.data.message);
        } catch (error) {
            const errorMessage = this.extractErrorMessage(error);
            console.error('Error deleting employee:', errorMessage);
            throw new Error(errorMessage);
        }
    }
}

export const employeeService = new EmployeeService();