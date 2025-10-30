import { api } from '../api';
import type { ListItem } from '../../types/List/list';

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
}

export const listService = new ListService();