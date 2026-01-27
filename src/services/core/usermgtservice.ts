import type {
  Step1Dto,
  EmpAddRes,
  BasicInfoDto,
  UUID,
} from "../../types/hr/employee/empAddDto";
import type { EmployeeListDto } from "../../types/hr/employee";
import { api } from "../api";

class UsermgmtService {
  private baseUrl = `${import.meta.env.VITE_HRMM_PROFILE_URL || "/hrm/profile/v1"}/AdminEmp`;

  // Helper method to extract error messages
  private extractErrorMessage(error: any): string {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.errors) {
      // Handle validation errors (object with field names as keys)
      const errors = error.response.data.errors;
      const errorMessages = Object.values(errors).flat();
      return errorMessages.join(", ");
    }
    if (error.message) {
      return error.message;
    }
    return "An unexpected error occurred";
  }

  // GET: /api/hrm/profile/v1/AdminEmp/AllEmployee
  async getAllEmployees(): Promise<EmployeeListDto[]> {
    try {
      const response = await api.get(`${this.baseUrl}/AllEmployee`);
      console.info("Fetched all employees successfully");
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error("Failed to fetch employees:", errorMessage);
      throw new Error(errorMessage);
    }
  }

  // POST: /api/hrm/profile/v1/AdminEmp/Step1
  async addEmployeeStep1(step1: Step1Dto): Promise<EmpAddRes> {
    try {
      const response = await api.post(`${this.baseUrl}/Step1`, step1, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.info(
        "Employee step 1 completed successfully:",
        response.data.data.id,
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error("Failed to create employee step 1:", errorMessage);
      throw new Error(errorMessage);
    }
  }

  // GET: /api/hrm/profile/v1/AdminEmp/Step2/{id}
  async getEmployeeStep2Data(employeeId: UUID): Promise<BasicInfoDto> {
    try {
      const response = await api.get(`${this.baseUrl}/Step2/${employeeId}`);
      console.info("Fetched employee step 2 data successfully:", employeeId);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error("Failed to fetch employee step 2 data:", errorMessage);
      throw new Error(errorMessage);
    }
  }
}

export const usermgmtService = new UsermgmtService();
