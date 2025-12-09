import type { EmpAddRes, Step1Dto, Step2Dto, Step3Dto, Step4Dto, Step5Dto, UUID } from "../../../types/hr/employee/empAddDto";
import { api } from "../../api";

class EmpService {
    private baseUrl = `${import.meta.env.VITE_HRMM_PROFILE_URL || "/hrm/profile/v1"}/AddEmp`;

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

    // POST: api/hrm/profile/v1/Step1
    async empAddStep1(step1: Step1Dto): Promise<EmpAddRes> {
        try {
            const response = await api.post(`${this.baseUrl}/Step1`, step1, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.info('Employee step 1 completed successfully:', response.data.data.id);
            return response.data.data.id;
        } catch (error) {
            const errorMessage = this.extractErrorMessage(error);
            console.error("Failed to create employee step 1:", errorMessage);
            throw new Error(errorMessage);
        }
    }

    // POST: api/hrm/profile/v1/Step2
    async empAddStep2(step2: Step2Dto): Promise<EmpAddRes> {
        try {
            const response = await api.post(`${this.baseUrl}/Step2`, step2);
            console.info('Employee step 2 completed successfully:', response.data.data.id);
            return response.data.data.id;
        } catch (error) {
            const errorMessage = this.extractErrorMessage(error);
            console.error("Failed to create employee step 2:", errorMessage);
            throw new Error(errorMessage);
        }
    }

    // POST: api/hrm/profile/v1/Step3
    async empAddStep3(step3: Step3Dto): Promise<EmpAddRes> {
        try {
            const response = await api.post(`${this.baseUrl}/Step3`, step3);
            console.info('Employee step 3 completed successfully:', response.data.data.id);
            return response.data.data.id;
        } catch (error) {
            const errorMessage = this.extractErrorMessage(error);
            console.error("Failed to create employee step 3:", errorMessage);
            throw new Error(errorMessage);
        }
    }

    // POST: api/hrm/profile/v1/Step4
    async empAddStep4(step4: Step4Dto): Promise<EmpAddRes> {
        try {
            const response = await api.post(`${this.baseUrl}/Step4`, step4, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.info('Employee step 4 completed successfully:', response.data.data.id);
            return response.data.data.id;
        } catch (error) {
            const errorMessage = this.extractErrorMessage(error);
            console.error("Failed to create employee step 4:", errorMessage);
            throw new Error(errorMessage);
        }
    }

    // GET: api/hrm/profile/v1/Step5/{id} - UPDATED to fetch Step5 data
    async getStep5Data(employeeId: UUID): Promise<Step5Dto> {
        try {
            const response = await api.get(`${this.baseUrl}/Step5/${employeeId}`);
            return response.data.data;
        } catch (error) {
            const errorMessage = this.extractErrorMessage(error);
            console.error("Failed to fetch employee review data:", errorMessage);
            throw new Error(errorMessage);
        }
    }

    // POST: api/hrm/profile/v1/Step5 - NEW: Submit final employee data
    async submitEmployee(step5Data: Step5Dto): Promise<EmpAddRes> {
        try {
            const response = await api.post(`${this.baseUrl}/Step5`, step5Data);
            console.info('Employee submission completed successfully:', response.data.data);
            return response.data.data;
        } catch (error) {
            const errorMessage = this.extractErrorMessage(error);
            console.error("Failed to complete employee submission:", errorMessage);
            throw new Error(errorMessage);
        }
    }
}

export const empService = new EmpService();