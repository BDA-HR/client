import { api } from "../../../../api";
import type {
  PolicyRuleCondListDto,
  PolicyRuleCondAddDto,
  PolicyRuleCondModDto,
  UUID,
} from "../../../../../types/core/Settings/PolicyRuleCondtion";

class PolicyRuleConditionApi {
  private baseUrl = `${
    import.meta.env.VITE_HRMM_LEAVE_URL || "hrm/leave/v1"
  }/PolicyRuleCond`;

  private extractErrorMessage(error: any): string {
    if (error.response?.data?.message) return error.response.data.message;
    if (error.response?.data?.errors) {
      return Object.values(error.response.data.errors).flat().join(", ");
    }
    if (error.message) return error.message;
    return "An unexpected error occurred";
  }

  // Get by ID
  async getById(id: UUID): Promise<PolicyRuleCondListDto> {
    try {
      const res = await api.get(`${this.baseUrl}/GetPolicyRuleCond/${id}`);
      return res.data.data;
    } catch (error) {
      throw new Error(this.extractErrorMessage(error));
    }
  }

  // Get All by Rule ID
  async getAllByRuleId(ruleId: UUID): Promise<PolicyRuleCondListDto[]> {
    try {
      const res = await api.get(`${this.baseUrl}/AllPolicyRuleCond/${ruleId}`);
      return res.data.data;
    } catch (error) {
      throw new Error(this.extractErrorMessage(error));
    }
  }

  // Create
  async create(data: PolicyRuleCondAddDto): Promise<PolicyRuleCondListDto> {
    try {
      const res = await api.post(`${this.baseUrl}/AddPolicyRuleCond`, data);
      return res.data.data;
    } catch (error) {
      throw new Error(this.extractErrorMessage(error));
    }
  }

  // Update
  async update(data: PolicyRuleCondModDto): Promise<PolicyRuleCondListDto> {
    try {
      const res = await api.put(
        `${this.baseUrl}/ModPolicyRuleCond/${data.id}`,
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
      const res = await api.delete(`${this.baseUrl}/DelPolicyRuleCond/${id}`);
      return res.data.data;
    } catch (error) {
      throw new Error(this.extractErrorMessage(error));
    }
  }
}

export const policyRuleConditionApi = new PolicyRuleConditionApi();

export const policyRuleConditionFetcher = {
  getById: (id: UUID) => policyRuleConditionApi.getById(id),
  getAllByRuleId: (ruleId: UUID) => policyRuleConditionApi.getAllByRuleId(ruleId),
  create: (data: PolicyRuleCondAddDto) => policyRuleConditionApi.create(data),
  update: (data: PolicyRuleCondModDto) => policyRuleConditionApi.update(data),
  delete: (id: UUID) => policyRuleConditionApi.delete(id),
};