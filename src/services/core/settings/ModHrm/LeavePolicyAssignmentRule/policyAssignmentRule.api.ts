import { api } from "../../../../api";
import type {
  PolicyAssignmentRuleListDto,
  PolicyAssignmentRuleAddDto,
  PolicyAssignmentRuleModDto,
  UUID,
} from "../../../../../types/core/Settings/policyAssignmentRule";

class PolicyAssignmentRuleApi {
  private baseUrl = `${
    import.meta.env.VITE_HRMM_LEAVE_URL || "hrm/leave/v1"
  }/PolicyAssignmentRule`;

  private extractErrorMessage(error: any): string {
    if (error.response?.data?.message) return error.response.data.message;
    if (error.response?.data?.errors) {
      return Object.values(error.response.data.errors).flat().join(", ");
    }
    if (error.message) return error.message;
    return "An unexpected error occurred";
  }

  // Get by ID
  async getById(id: UUID): Promise<PolicyAssignmentRuleListDto> {
    try {
      const res = await api.get(`${this.baseUrl}/GetPolicyAssRule/${id}`);
      return res.data.data;
    } catch (error) {
      throw new Error(this.extractErrorMessage(error));
    }
  }

  // Get Active by ID
  async getActiveById(id: UUID): Promise<PolicyAssignmentRuleListDto> {
    try {
      const res = await api.get(`${this.baseUrl}/ActivePolicyAssRule/${id}`);
      return res.data.data;
    } catch (error) {
      throw new Error(this.extractErrorMessage(error));
    }
  }

  // Get All by Policy ID - Fixed endpoint name
  async getAllByPolicyId(policyId: UUID): Promise<PolicyAssignmentRuleListDto[]> {
    try {
      const res = await api.get(`${this.baseUrl}/AllPolicyAssRule/${policyId}`);
      return res.data.data;
    } catch (error) {
      throw new Error(this.extractErrorMessage(error));
    }
  }

  // Create
  async create(
    data: PolicyAssignmentRuleAddDto,
  ): Promise<PolicyAssignmentRuleListDto> {
    try {
      const res = await api.post(`${this.baseUrl}/AddPolicyAssRule`, data);
      return res.data.data;
    } catch (error) {
      throw new Error(this.extractErrorMessage(error));
    }
  }

  // Update
  async update(
    data: PolicyAssignmentRuleModDto,
  ): Promise<PolicyAssignmentRuleListDto> {
    try {
      const res = await api.put(
        `${this.baseUrl}/ModPolicyAssRule/${data.id}`,
        data,
      );
      return res.data.data;
    } catch (error) {
      throw new Error(this.extractErrorMessage(error));
    }
  }

  // Delete
  async delete(id: UUID) {
    try {
      const res = await api.delete(`${this.baseUrl}/DelPolicyAssRule/${id}`);
      return res.data.data;
    } catch (error) {
      throw new Error(this.extractErrorMessage(error));
    }
  }
}

export const policyAssignmentRuleApi = new PolicyAssignmentRuleApi();

export const policyAssignmentRuleFetcher = {
  getById: (id: UUID) => policyAssignmentRuleApi.getById(id),
  getActiveById: (id: UUID) => policyAssignmentRuleApi.getActiveById(id),
  getAllByPolicyId: (policyId: UUID) => policyAssignmentRuleApi.getAllByPolicyId(policyId),
  create: (data: PolicyAssignmentRuleAddDto) =>
    policyAssignmentRuleApi.create(data),
  update: (data: PolicyAssignmentRuleModDto) =>
    policyAssignmentRuleApi.update(data),
  delete: (id: UUID) => policyAssignmentRuleApi.delete(id),
};