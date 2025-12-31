import { api } from '../api';
import type { ListItem } from '../../types/List/list';
import type { NameListItem } from '../../types/NameList/nameList'; // Add this import

class ListService {
  private baseUrl = `${import.meta.env.VITE_LUP_URL || '/lup/v1'}`;

  // Quarter services
  async getAllQuarters(): Promise<ListItem[]> {
    try {
      const response = await api.get(`${this.baseUrl}/Quarter`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quarters:', error);
      throw error;
    }
  }

  // EducationLevel services
  async getAllEducationLevels(): Promise<ListItem[]> {
    try {
      const response = await api.get(`${this.baseUrl}/EducationLevel`);
      return response.data;
    } catch (error) {
      console.error('Error fetching education levels:', error);
      throw error;
    }
  }

  // Relation services
  async getAllRelations(): Promise<ListItem[]> {
    try {
      const response = await api.get(`${this.baseUrl}/Relation`);
      return response.data;
    } catch (error) {
      console.error('Error fetching relations:', error);
      throw error;
    }
  }

  

  // ========== Module Name Services ==========
  
  // GET: /api/auth/v1/Names/AllModuleName
  async getAllModuleNames(): Promise<NameListItem[]> {
    try {
      const response = await api.get('/auth/v1/Names/AllModuleName');
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('Error fetching module names:', error);
      throw error;
    }
  }

  // GET: /api/auth/v1/Names/GetModuleName/{id}
  async getModuleNameById(id: string): Promise<NameListItem> {
    try {
      const response = await api.get(`/auth/v1/Names/GetModuleName/${id}`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error fetching module name:', error);
      throw error;
    }
  }

    // ========== Role Services ==========
  
  // GET: /api/auth/v1/Permission/AllRole
  async getAllRoles(): Promise<NameListItem[]> {
    try {
      const response = await api.get('/auth/v1/Permission/AllRole');
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  }

}

export const listService = new ListService();