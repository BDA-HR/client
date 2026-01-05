import { api } from '../../../api';
import type {
  ModPerMenuListDto,
  PerMenuListDto,
  PerMenuAddDto,
  PerMenuModDto
} from '../../../../types/core/Settings/menu-permissions';
import type { NameListItem } from '../../../../types/NameList/nameList';

class MenuPermissionService {
  private baseUrl = `/auth/v1/PerMenu`; 
  private namesBaseUrl = `/auth/v1/Names`;

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

  // GET: /api/auth/v1/Names/AllModuleName
  async getAllModuleNames(): Promise<NameListItem[]> {
    try {
      console.log('Fetching modules from:', `${this.namesBaseUrl}/AllModuleName`);
      const response = await api.get(`${this.namesBaseUrl}/AllModuleName`);
      console.log('Module names response:', response.data);
      const modules = response.data?.data || response.data;
      return Array.isArray(modules) ? modules : [];
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error fetching module names:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // GET: /api/auth/v1/Names/GetModuleName/{id}
  async getModuleNameById(id: string): Promise<NameListItem> {
    try {
      const response = await api.get(`${this.namesBaseUrl}/GetModuleName/${id}`);
      return response.data?.data || response.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error fetching module name:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // GET: /api/auth/v1/PerMenu/AllPerMenu
  async getAllMenuPermissions(): Promise<PerMenuListDto[]> {
    try {
      const response = await api.get(`${this.baseUrl}/AllPerMenu`);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error fetching menu permissions:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // GET: /api/auth/v1/PerMenu/GetPerMenu/{id}
  async getMenuPermissionById(id: string): Promise<PerMenuListDto> {
    try {
      const response = await api.get(`${this.baseUrl}/GetPerMenu/${id}`);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error fetching menu permission:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // POST: /api/auth/v1/PerMenu/AddPerMenu
  async createMenuPermission(menuPermission: PerMenuAddDto): Promise<PerMenuListDto> {
    try {
      const response = await api.post(`${this.baseUrl}/AddPerMenu`, menuPermission);
      console.info('Menu permission created successfully:', response.data.data.id);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error creating menu permission:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // PUT: /api/auth/v1/PerMenu/ModPerMenu/{id}
  async updateMenuPermission(updateData: PerMenuModDto): Promise<PerMenuListDto> {
    try {
      const response = await api.put(`${this.baseUrl}/ModPerMenu/${updateData.id}`, updateData);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error updating menu permission:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // DELETE: /api/auth/v1/PerMenu/DelPerMenu/{id}
  async deleteMenuPermission(id: string): Promise<void> {
    try {
      const response = await api.delete(`${this.baseUrl}/DelPerMenu/${id}`);
      console.info('Menu permission deleted successfully:', response.data.message);
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error deleting menu permission:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  async getMenuPermissionsByModule(): Promise<ModPerMenuListDto[]> {
    try {
      const response = await api.get(`${this.baseUrl}/AllPerMenu`);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error fetching menu permissions by module:', errorMessage);
      throw new Error(errorMessage);
    }
  }
}

export const menuPermissionService = new MenuPermissionService();