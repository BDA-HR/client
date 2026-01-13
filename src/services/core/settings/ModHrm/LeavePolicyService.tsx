import { api } from '../../../api';
import type {
  LeavePolicyListDto,
  LeavePolicyAddDto,
  LeavePolicyModDto,
  UUID
} from '../../../../types/core/Settings/leavepolicy';

class LeavePolicyService {
  // private baseUrl = `${import.meta.env.VITE_HRMM_MODULE_URL}/LeavePolicy`;
  private baseUrl = `${import.meta.env.VITE_HRMM_LEAVE_URL || 'hrm/leave/v1'}/LeavePolicy`;

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

  // GET: /AllLeavePolicy
  async getAllLeavePolicies(): Promise<LeavePolicyListDto[]> {
    try {
      const response = await api.get(`${this.baseUrl}/AllLeavePolicy`);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error fetching leave policies:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // GET: /GetLeavePolicy/{id}
  async getLeavePolicyById(id: UUID): Promise<LeavePolicyListDto> {
    try {
      const response = await api.get(`${this.baseUrl}/GetLeavePolicy/${id}`);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error fetching leave policy:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // POST: /AddLeavePolicy
  async createLeavePolicy(leavePolicy: LeavePolicyAddDto): Promise<LeavePolicyListDto> {
    try {
      const response = await api.post(`${this.baseUrl}/AddLeavePolicy`, leavePolicy);
      console.info('Leave policy created successfully:', response.data.data.id);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error creating leave policy:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // PUT: /ModLeavePolicy/{id}
  async updateLeavePolicy(updateData: LeavePolicyModDto): Promise<LeavePolicyListDto> {
    try {
      const response = await api.put(`${this.baseUrl}/ModLeavePolicy/${updateData.id}`, updateData);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error updating leave policy:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // DELETE: /DelLeavePolicy/{id}
  async deleteLeavePolicy(id: UUID): Promise<void> {
    try {
      const response = await api.delete(`${this.baseUrl}/DelLeavePolicy/${id}`);
      console.info('Leave policy deleted successfully:', response.data.message);
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error deleting leave policy:', errorMessage);
      throw new Error(errorMessage);
    }
  }
}

export const leavePolicyService = new LeavePolicyService();