import { api } from '../api';
import type { UUID, ListItem } from '../../types/List/list';

class ListService {
  private baseUrl = `${import.meta.env.VITE_CORE_MODULE_URL || 'lup/v1'}`;

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

  async getQuarterById(id: UUID): Promise<ListItem> {
    try {
      const response = await api.get(`${this.baseUrl}/Quarter/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quarter:', error);
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

  async getEducationLevelById(id: UUID): Promise<ListItem> {
    try {
      const response = await api.get(`${this.baseUrl}/EducationLevel/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching education level:', error);
      throw error;
    }
  }
}

export const listService = new ListService();