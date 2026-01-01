import { api } from '../api';
import type { 
  LeaveRequestListDto, 
  LeaveRequestAddDto,
  LeaveRequestModDto,  
  UUID 
} from '../../types/hr/leaverequest';

interface ApiResponse<T> {
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

class LeaveService {
  private baseUrl = `${import.meta.env.VITE_HRMM_LEAVE_URL || 'hrm/leave/v1'}/LeaveRequest`;
  
  private extractErrorMessage(error: any): string {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      const errorMessages = Object.values(errors).flat();
      return errorMessages.join(', ');
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }

  // POST: /api/hrm/leave/v1/LeaveRequest/AddNewReq
  async addLeaveRequest(leaveData: LeaveRequestAddDto): Promise<LeaveRequestListDto> {
    try {
      const response = await api.post<ApiResponse<LeaveRequestListDto>>(
        `${this.baseUrl}/AddNewReq`, 
        leaveData
      );
      console.info('Leave request created successfully:', response.data.data?.id);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error creating leave request:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // GET: /api/hrm/leave/v1/LeaveRequest/MyLeaveReq
  async getMyLeaveRequests(): Promise<LeaveRequestListDto[]> {
    try {
      const response = await api.get<ApiResponse<LeaveRequestListDto[]>>(
        `${this.baseUrl}/MyLeaveReq`
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error fetching leave requests:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // GET: /api/hrm/leave/v1/LeaveRequest/GetLeaveReq/{id}
  async getLeaveRequestById(id: UUID): Promise<LeaveRequestListDto> {
    try {
      const response = await api.get<ApiResponse<LeaveRequestListDto>>(
        `${this.baseUrl}/GetLeaveReq/${id}`
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error fetching leave request:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // PUT: /api/hrm/leave/v1/LeaveRequest/UpdateLeaveReq/{id}
  async updateLeaveRequest(updateData: LeaveRequestModDto): Promise<LeaveRequestListDto> {
    try {
      const response = await api.put<ApiResponse<LeaveRequestListDto>>(
        `${this.baseUrl}/UpdateLeaveReq/${updateData.id}`, 
        updateData
      );
      console.info('Leave request updated successfully:', response.data.data?.id);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error updating leave request:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // DELETE: /api/hrm/leave/v1/LeaveRequest/DeleteLeaveReq/{id}
  async deleteLeaveRequest(id: UUID): Promise<void> {
    try {
      const response = await api.delete<ApiResponse<void>>(
        `${this.baseUrl}/DeleteLeaveReq/${id}`
      );
      console.info('Leave request deleted successfully:', response.data.message);
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error deleting leave request:', errorMessage);
      throw new Error(errorMessage);
    }
  }
}

export const leaveService = new LeaveService();