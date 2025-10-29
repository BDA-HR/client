import type { UUID } from "crypto";
import type { EmpAddRes, Step1Dto, Step2Dto, Step3Dto, Step4Dto } from "../../../types/hr/employee/empAddDto";
import { api } from "../../api";

class EmpService {
    private baseUrl = `${import.meta.env.VITE_HRMM_PROFILE_URL || "/hrm/profile/v1"}/AddEmp`;
    //   private braUrl = `${import.meta.env.VITE_CORE_MODULE_URL || 'core/module/v1'}/Names`;

    // POST: api/hrm/profile/v1/Step1
    async empAddStep1(step1: Step1Dto): Promise<EmpAddRes> {
        try {
            const response = await api.post(`${this.baseUrl}/Step1`, step1);
            return response.data.id;
        } catch (error) {
            console.error("Failed to create Employee :", error);
            throw error;
        }
    }

    // POST: api/hrm/profile/v1/Step1
    async empAddStep2(step2: Step2Dto): Promise<EmpAddRes> {
        try {
            const response = await api.post(`${this.baseUrl}/Step2`, step2);
            return response.data.id;
        } catch (error) {
            console.error("Failed to create Employee :", error);
            throw error;
        }
    }

    // POST: api/hrm/profile/v1/Step1
    async empAddStep3(step3: Step3Dto): Promise<EmpAddRes> {
        try {
            const response = await api.post(`${this.baseUrl}/Step3`, step3);
            return response.data.id;
        } catch (error) {
            console.error("Failed to create Employee :", error);
            throw error;
        }
    }

    // POST: api/hrm/profile/v1/Step1
    async empAddStep4(step4: Step4Dto): Promise<EmpAddRes> {
        try {
            const response = await api.post(`${this.baseUrl}/Step4`, step4);
            return response.data.id;
        } catch (error) {
            console.error("Failed to create Employee :", error);
            throw error;
        }
    }

    // DELETE: baseurl/DelBranch/{id}
    async deleteBranch(id: UUID): Promise<void> {
        try {
            await api.delete(`${this.baseUrl}/DelBranch/${id}`);
        } catch (error) {
            console.error("Error deleting Employee:", error);
            throw error;
        }
    }
}

export const empService = new EmpService();
