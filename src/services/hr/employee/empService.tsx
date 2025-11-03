import type { EmpAddRes, Step1Dto, Step2Dto, Step3Dto, Step4Dto, Step5Dto, UUID } from "../../../types/hr/employee/empAddDto";
import { api } from "../../api";


class EmpService {
    private baseUrl = `${import.meta.env.VITE_HRMM_PROFILE_URL || "/hrm/profile/v1"}/AddEmp`;
    //   private braUrl = `${import.meta.env.VITE_CORE_MODULE_URL || 'core/module/v1'}/Names`;

    // POST: api/hrm/profile/v1/Step1
    async empAddStep1(step1: Step1Dto): Promise<EmpAddRes> {
        try {
            const response = await api.post(`${this.baseUrl}/Step1`, step1, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // return response.data.id;
            return response.data;
        } catch (error) {
            console.error("Failed to create Employee :", error);
            throw error;
        }
    }

    // POST: api/hrm/profile/v1/Step2
    async empAddStep2(step2: Step2Dto): Promise<EmpAddRes> {
        try {
            const response = await api.post(`${this.baseUrl}/Step2`, step2);
            return response.data.id;
        } catch (error) {
            console.error("Failed to create Employee :", error);
            throw error;
        }
    }

    // POST: api/hrm/profile/v1/Step3
    async empAddStep3(step3: Step3Dto): Promise<EmpAddRes> {
        try {
            const response = await api.post(`${this.baseUrl}/Step3`, step3);
            return response.data.id;
        } catch (error) {
            console.error("Failed to create Employee :", error);
            throw error;
        }
    }

    // POST: api/hrm/profile/v1/Step4
    async empAddStep4(step4: Step4Dto): Promise<EmpAddRes> {
        try {
            const response = await api.post(`${this.baseUrl}/Step4`, step4, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            console.error("Failed to create Employee :", error);
            throw error;
        }
    }

       // POST: api/hrm/profile/v1/Step5/{id}
    async empAddStep5(step5: Step5Dto, employeeId: UUID): Promise<EmpAddRes> {
        try {
            const response = await api.post(`${this.baseUrl}/Step5/${employeeId}`, step5);
            return response.data;
        } catch (error) {
            console.error("Failed to complete employee submission:", error);
            throw error;
        }
    }

}

export const empService = new EmpService();
