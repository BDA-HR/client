import { api } from "../../../../api";
import type {
  LeavePolicyConfigListDto,
  LeavePolicyConfigAddDto,
  LeavePolicyConfigModDto,
  UUID,
} from "../../../../../types/core/Settings/leavePolicyConfig";
import type { StatChangeDto } from "../../../../../types/core/Settings/statChangeDto";

class LeavePolicyConfigApi {
  private baseUrl = `${
    import.meta.env.VITE_HRMM_LEAVE_URL || "hrm/leave/v1"
  }/LeavePolicyConfig`;

  private extractErrorMessage(error: any): string {
    if (error.response?.data?.message) return error.response.data.message;
    if (error.response?.data?.errors) {
      return Object.values(error.response.data.errors).flat().join(", ");
    }
    if (error.message) return error.message;
    return "An unexpected error occurred";
  }

  async getById(id: UUID): Promise<LeavePolicyConfigListDto> {
    try {
      const res = await api.get(`${this.baseUrl}/GetPolicyConfig/${id}`);
      return res.data.data;
    } catch (error) {
      throw new Error(this.extractErrorMessage(error));
    }
  }

  async getActiveById(id: UUID): Promise<LeavePolicyConfigListDto> {
    try {
      const res = await api.get(`${this.baseUrl}/ActivePolicyConfig/${id}`);
      return res.data.data;
    } catch (error) {
      throw new Error(this.extractErrorMessage(error));
    }
  }

  async getAllById(id: UUID): Promise<LeavePolicyConfigListDto[]> {
    try {
      const res = await api.get(`${this.baseUrl}/AllPolicyConfig/${id}`);
      return res.data.data;
    } catch (error) {
      throw new Error(this.extractErrorMessage(error));
    }
  }

  async create(
    data: LeavePolicyConfigAddDto,
  ): Promise<LeavePolicyConfigListDto> {
    try {
      const res = await api.post(`${this.baseUrl}/AddPolicyConfig`, data);
      return res.data.data;
    } catch (error) {
      throw new Error(this.extractErrorMessage(error));
    }
  }

  async update(
    data: LeavePolicyConfigModDto,
  ): Promise<LeavePolicyConfigListDto> {
    try {
      const res = await api.put(
        `${this.baseUrl}/ModPolicyConfig/${data.id}`,
        data,
      );
      return res.data.data;
    } catch (error) {
      throw new Error(this.extractErrorMessage(error));
    }
  }

  async changeStatus(data: StatChangeDto): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/StatPolicyConfig`, data);
    } catch (error) {
      throw new Error(this.extractErrorMessage(error));
    }
  }

  async delete(id: UUID) {
    try {
      const res = await api.delete(`${this.baseUrl}/DelPolicyConfig/${id}`);
      return res.data.data;
    } catch (error) {
      throw new Error(this.extractErrorMessage(error));
    }
  }
}

export const leavePolicyConfigApi = new LeavePolicyConfigApi();

export const leavePolicyConfigFetcher = {
  getById: (id: UUID) => leavePolicyConfigApi.getById(id),
  getActiveById: (id: UUID) => leavePolicyConfigApi.getActiveById(id),
  getAllById: (id: UUID) => leavePolicyConfigApi.getAllById(id),
  create: (data: LeavePolicyConfigAddDto) => leavePolicyConfigApi.create(data),
  update: (data: LeavePolicyConfigModDto) => leavePolicyConfigApi.update(data),
  changeStatus: (data: StatChangeDto) => leavePolicyConfigApi.changeStatus(data),
  delete:(id:UUID) => leavePolicyConfigApi.delete(id),
};
