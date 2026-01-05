import { api } from '../../../api';
import type {
  LeaveTypeListDto,
  LeaveTypeAddDto,
  LeaveTypeModDto,
  UUID
} from '../../../../types/hr/leavetype';

class LeaveTypeService {
  private baseUrl = `${import.meta.env.VITE_HRMM_LEAVE_URL || 'hrm/leave/v1'}/LeaveType`;

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

  // GET: /AllLeaveType
  async getAllLeaveTypes(): Promise<LeaveTypeListDto[]> {
    try {
      const response = await api.get(`${this.baseUrl}/AllLeaveType`);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error fetching leave types:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // GET: GetLeaveType/{id}
  async getLeaveTypeById(id: UUID): Promise<LeaveTypeListDto> {
    try {
      const response = await api.get(`${this.baseUrl}/GetLeaveType/${id}`);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error fetching leave type:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // POST: /AddLeaveType
  async createLeaveType(leaveType: LeaveTypeAddDto): Promise<LeaveTypeListDto> {
    try {
      const response = await api.post(`${this.baseUrl}/AddLeaveType`, leaveType);
      console.info('Leave type created successfully:', response.data.data.id);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error creating leave type:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // PUT: /ModLeaveType/{id}
  async updateLeaveType(updateData: LeaveTypeModDto): Promise<LeaveTypeListDto> {
    try {
      const response = await api.put(`${this.baseUrl}/ModLeaveType/${updateData.id}`, updateData);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error updating leave type:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // DELETE: /DelLeaveType/{id}
  async deleteLeaveType(id: UUID): Promise<void> {
    try {
      const response = await api.delete(`${this.baseUrl}/DelLeaveType/${id}`);
      console.info('Leave type deleted successfully:', response.data.message);
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error deleting leave type:', errorMessage);
      throw new Error(errorMessage);
    }
  }
}

export const leaveTypeService = new LeaveTypeService();