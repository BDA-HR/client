import { api } from '../api';
import type { EmpSearchRes } from '../../types/core/EmpSearchRes';

class UserManagementService {
  private baseUrl = `${import.meta.env.VITE_HRM_MODULE_URL || 'hrm/profile/v1'}/EmpSearch`;

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

  /**
   * Search employee by code
   * GET /api/hrm/profile/v1/EmpSearch/EmpByCode/{code}
   */
  async getEmployeeByCode(code: string): Promise<EmpSearchRes> {
    try {
      if (!code || !/^[A-Za-z0-9]{10}$/.test(code)) {
        throw new Error('Employee code must be exactly 10 alphanumeric characters');
      }

      const response = await api.get(`${this.baseUrl}/EmpByCode/${code}`);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error fetching employee by code:', errorMessage);
      throw new Error(errorMessage);
    }
  }

 
}

export const userManagementService = new UserManagementService();