import { api } from '../api';
import type { 
  ModPerMenuListDto, 
  NameList,
  UUID 
} from '../../types/auth/ModPerMenu';

class PerMenuService {
  private baseUrl = `${import.meta.env.VITE_AUTH_MODULE_URL || 'auth/v1'}/Permission`;

  // Helper method to extract error messages
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

  // GET: /api/auth/v1/Permission/GetPerMenuByUser/{id}
  async getPerMenusByUser(userId: UUID): Promise<ModPerMenuListDto[]> {
    try {
      const response = await api.get(`${this.baseUrl}/GetPerMenuByUser/${userId}`);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error fetching permission menus by user:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // Helper: Filter permissions by selected module IDs
  async getFilteredPermissionsForUser(
    userId: UUID, 
    selectedModuleIds: UUID[]
  ): Promise<ModPerMenuListDto[]> {
    try {
      const userPermissions = await this.getPerMenusByUser(userId);
      
      // Filter to include only selected modules
      const filtered = userPermissions.filter(moduleGroup => 
        selectedModuleIds.includes(moduleGroup.perModuleId)
      );
      
      return filtered;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error filtering permissions for user:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // Helper: Get flattened permissions for selected modules
  async getFlattenedPermissionsForUser(
    userId: UUID, 
    selectedModuleIds: UUID[]
  ): Promise<Array<NameList & { moduleId: UUID; moduleName: string }>> {
    try {
      const filteredPermissions = await this.getFilteredPermissionsForUser(userId, selectedModuleIds);
      const flattened: Array<NameList & { moduleId: UUID; moduleName: string }> = [];
      
      for (const moduleGroup of filteredPermissions) {
        for (const permission of moduleGroup.perMenuList) {
          flattened.push({
            ...permission,
            moduleId: moduleGroup.perModuleId,
            moduleName: moduleGroup.perModule
          });
        }
      }
      
      return flattened;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error flattening permissions for user:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // Helper: Get available modules for user
  async getAvailableModulesForUser(userId: UUID): Promise<Array<{ id: UUID; name: string }>> {
    try {
      const userPermissions = await this.getPerMenusByUser(userId);
      
      return userPermissions.map(moduleGroup => ({
        id: moduleGroup.perModuleId,
        name: moduleGroup.perModule
      }));
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error getting available modules for user:', errorMessage);
      throw new Error(errorMessage);
    }
  }
}

export const perMenuService = new PerMenuService();