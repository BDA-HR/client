import { api } from '../api';
import type { HierListDto, AddHierDto, EditHierDto, UUID } from '../../types/core/hier';

class HierarchyService {
  private baseUrl = `${import.meta.env.VITE_CORE_URL || 'core/v1'}/hierarchy`;

  async getAllHierarchies(): Promise<HierListDto[]> {
    try {
      const response = await api.get(`${this.baseUrl}/AllHierarchy`);
      return response.data;
    } catch (error) {
      console.error('Error fetching hierarchies:', error);
      throw error;
    }
  }

  async getHierarchyById(id: UUID): Promise<HierListDto> {
    try {
      const response = await api.get(`${this.baseUrl}/GetHierarchy/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching hierarchy:', error);
      throw error;
    }
  }

  async createHierarchy(hierarchy: AddHierDto): Promise<HierListDto> {
    try {
      const response = await api.post(`${this.baseUrl}/AddHierarchy`, hierarchy);
      return response.data;
    } catch (error) {
      console.error('Error creating hierarchy:', error);
      throw error;
    }
  }

  async updateHierarchy(updateData: EditHierDto): Promise<HierListDto> {
    try {
      const response = await api.put(`${this.baseUrl}/ModHierarchy/${updateData.id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating hierarchy:', error);
      throw error;
    }
  }

  async deleteHierarchy(id: UUID): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/DelHierarchy/${id}`);
    } catch (error) {
      console.error('Error deleting hierarchy:', error);
      throw error;
    }
  }
}

export const hierarchyService = new HierarchyService();