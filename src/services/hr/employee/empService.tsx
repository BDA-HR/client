import type { AddBranchDto, BranchListDto } from "../../../types/core/branch";
import { api } from "../../api";

class EmpService {
  private baseUrl = `${
    import.meta.env.VITE_CORE_MODULE_URL || "core/module/v1"
  }/Branch`;
  //   private braUrl = `${import.meta.env.VITE_CORE_MODULE_URL || 'core/module/v1'}/Names`;

  // POST: baseurl/AddBranch
  async createBranch(branch: AddBranchDto): Promise<BranchListDto> {
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
