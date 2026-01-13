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
    // Check for specific database constraint violations
    if (error.response?.data?.message) {
      const message = error.response.data.message;
      
      // Handle PostgreSQL unique constraint violation (23505)
      if (message.includes('23505') || message.toLowerCase().includes('duplicate') || message.toLowerCase().includes('unique constraint')) {
        if (message.toLowerCase().includes('key') || message.toLowerCase().includes('permenu_key')) {
          return 'A menu permission with this key already exists. Please use a different key.';
        }
        return 'This value already exists. Please use a different value.';
      }
      
      // Handle other common database errors
      if (message.includes('23503')) {
        return 'Invalid reference. Please check your module selection.';
      }
      
      if (message.includes('23502')) {
        return 'Required field is missing. Please fill all required fields.';
      }
      
      return message;
    }
    
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      const errorMessages = Object.values(errors).flat();
      return errorMessages.join(', ');
    }
    
    if (error.message) {
      const message = error.message;
      
      // Handle client-side detected constraint violations
      if (message.includes('23505') || message.toLowerCase().includes('duplicate')) {
        return 'A menu permission with this key already exists. Please use a different key.';
      }
      
      return message;
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
      console.log('Raw API response:', response.data);
      console.log('Menu permissions data:', response.data.data);
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