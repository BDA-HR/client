import { api } from "../../../../api";
import type {
  LeavePolicyConfigListDto,
  LeavePolicyConfigAddDto,
  UUID,
  LeavePolicyConfigModDto,
} from "../../../../../types/core/Settings/leavePolicyConfig";

class LeavePolicyConfigService {
  private baseUrl = `${
    import.meta.env.VITE_HRMM_LEAVE_URL || "hrm/leave/v1"
  }/LeavePolicyConfig`;

  private extractErrorMessage(error: any): string {
    if (error.response?.data?.message) return error.response.data.message;
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      return Object.values(errors).flat().join(", ");
    }
    if (error.message) return error.message;
    return "An unexpected error occurred";
  }

  // GET by ID
  async getById(id: UUID): Promise<LeavePolicyConfigListDto> {
    try {
      const response = await api.get(
        `${this.baseUrl}/GetLeavePolicyConfig/${id}`
      );
      return response.data.data;
    } catch (error) {
      throw new Error(this.extractErrorMessage(error));
    }
  }

  // CREATE
  async create(
    data: LeavePolicyConfigAddDto
  ): Promise<LeavePolicyConfigListDto> {
    try {
      const response = await api.post(
        `${this.baseUrl}/AddLeavePolicyConfig`,
        data
      );
      return response.data.data;
    } catch (error) {
      throw new Error(this.extractErrorMessage(error));
    }
  }

  // UPDATE
  async update(
    data: LeavePolicyConfigModDto
  ): Promise<LeavePolicyConfigListDto> {
    try {
      const response = await api.put(
        `${this.baseUrl}/ModLeavePolicyConfig/${data.id}`,
        data
      );
      return response.data.data;
    } catch (error) {
      throw new Error(this.extractErrorMessage(error));
    }
  }

  // DELETE
  async delete(id: UUID): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/DelLeavePolicyConfig/${id}`);
    } catch (error) {
      throw new Error(this.extractErrorMessage(error));
    }
  }
}

export const leavePolicyConfigService = new LeavePolicyConfigService();
