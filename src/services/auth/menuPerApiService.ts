import { api } from '../api';
import type { 
  MenuPerApiListDto,
  NameList,
  UUID 
} from '../../types/auth/MenuPerApi';

class MenuPerApiService {
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

  async getPerApisByUser(userId: UUID): Promise<MenuPerApiListDto[]> {
    try {
      const response = await api.get(`${this.baseUrl}/GetPerApiByUser/${userId}`);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error fetching API permissions by user:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  async getFilteredPerApisForUser(
    userId: UUID, 
    selectedMenuIds: UUID[]
  ): Promise<MenuPerApiListDto[]> {
    try {
      const userApiPermissions = await this.getPerApisByUser(userId);
      
      const filtered = userApiPermissions.filter(menuGroup => 
        selectedMenuIds.includes(menuGroup.perMenuId)
      );
      
      return filtered;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error filtering API permissions for user:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  async getFlattenedPerApisForUser(
    userId: UUID, 
    selectedMenuIds: UUID[]
  ): Promise<Array<NameList & { menuId: UUID; menuName: string }>> {
    try {
      const filteredApiPermissions = await this.getFilteredPerApisForUser(userId, selectedMenuIds);
      const flattened: Array<NameList & { menuId: UUID; menuName: string }> = [];
      
      for (const menuGroup of filteredApiPermissions) {
        for (const apiPermission of menuGroup.perApiList) {
          flattened.push({
            ...apiPermission,
            menuId: menuGroup.perMenuId,
            menuName: menuGroup.perMenu
          });
        }
      }
      
      return flattened;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error flattening API permissions for user:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  async getAvailableMenusForUser(userId: UUID): Promise<Array<{ id: UUID; name: string }>> {
    try {
      const userApiPermissions = await this.getPerApisByUser(userId);
      
      return userApiPermissions.map(menuGroup => ({
        id: menuGroup.perMenuId,
        name: menuGroup.perMenu
      }));
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error getting available menus for user:', errorMessage);
      throw new Error(errorMessage);
    }
  }
}

export const menuPerApiService = new MenuPerApiService();