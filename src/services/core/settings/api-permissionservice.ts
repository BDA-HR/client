import { api } from '../../api';
import type {
  MenuPerApiListDto,
  PerApiListDto,
  PerApiAddDto,
  PerApiModDto
} from '../../../types/core/Settings/api-permission';

class ApiPermissionService {
  private baseUrl = `${import.meta.env.VITE_AUTH_URL || 'auth/v1'}/PerApi`;

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

  // GET: /api/auth/v1/PerApi/AllPerApi
  async getAllApiPermissions(): Promise<PerApiListDto[]> {
    try {
      const response = await api.get(`${this.baseUrl}/AllPerApi`);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error fetching API permissions:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // GET: /api/auth/v1/PerApi/GetPerApi/{id}
  async getApiPermissionById(id: string): Promise<PerApiListDto> {
    try {
      const response = await api.get(`${this.baseUrl}/GetPerApi/${id}`);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error fetching API permission:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // POST: /api/auth/v1/PerApi/AddPerApi
  async createApiPermission(apiPermission: PerApiAddDto): Promise<PerApiListDto> {
    try {
      const response = await api.post(`${this.baseUrl}/AddPerApi`, apiPermission);
      console.info('API permission created successfully:', response.data.data.id);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error creating API permission:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // PUT: /api/auth/v1/PerApi/ModPerApi/{id}
  async updateApiPermission(updateData: PerApiModDto): Promise<PerApiListDto> {
    try {
      const response = await api.put(`${this.baseUrl}/ModPerApi/${updateData.id}`, updateData);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error updating API permission:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // DELETE: /api/auth/v1/PerApi/DelPerApi/{id}
  async deleteApiPermission(id: string): Promise<void> {
    try {
      const response = await api.delete(`${this.baseUrl}/DelPerApi/${id}`);
      console.info('API permission deleted successfully:', response.data.message);
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error deleting API permission:', errorMessage);
      throw new Error(errorMessage);
    }
  }
  async getApiPermissionsByMenu(): Promise<MenuPerApiListDto[]> {
    try {
      const response = await api.get(`${this.baseUrl}/AllPerApi`);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error fetching API permissions by menu:', errorMessage);
      throw new Error(errorMessage);
    }
  }
}

export const apiPermissionService = new ApiPermissionService();