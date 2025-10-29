import type { UUID } from "crypto";
import type { EmpAddRes, Step1Dto } from "../../../types/hr/employee/empAddDto";
import { api } from "../../api";

class EmpService {
    private baseUrl = `${import.meta.env.VITE_CORE_MODULE_URL || "core/module/v1"}/Branch`;
    //   private braUrl = `${import.meta.env.VITE_CORE_MODULE_URL || 'core/module/v1'}/Names`;

    // POST: baseurl/AddBranch
    async empAddStep1(branch: Step1Dto): Promise<EmpAddRes> {
        try {
            const response = await api.post(`${this.baseUrl}/AddBranch`, branch);
            return response.data;
        } catch (error) {
            console.error("Error creating branch:", error);
            throw error;
        }
    }

    // DELETE: baseurl/DelBranch/{id}
    async deleteBranch(id: UUID): Promise<void> {
        try {
            await api.delete(`${this.baseUrl}/DelBranch/${id}`);
        } catch (error) {
            console.error("Error deleting branch:", error);
            throw error;
        }
    }
}

export const empService = new EmpService();
