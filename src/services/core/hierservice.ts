import { api } from '../api';
import type { HierListDto, AddHierDto, EditHierDto, UUID } from '../../types/core/hier';

class HierarchyService {
  private baseUrl = `${import.meta.env.VITE_CORE_MODULE_URL || 'core/module/v1'}/hierarchy`;

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

  async getAllHierarchies(): Promise<HierListDto[]> {
    try {
      const response = await api.get(`${this.baseUrl}/AllHierarchy`);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error fetching hierarchies:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  async getHierarchyById(id: UUID): Promise<HierListDto> {
    try {
      const response = await api.get(`${this.baseUrl}/GetHierarchy/${id}`);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error fetching hierarchy:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  async createHierarchy(hierarchy: AddHierDto): Promise<HierListDto> {
    try {
      const response = await api.post(`${this.baseUrl}/AddHierarchy`, hierarchy);
      console.info('Hierarchy created successfully:', response.data.id);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error creating hierarchy:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  async updateHierarchy(updateData: EditHierDto): Promise<HierListDto> {
    try {
      const response = await api.put(`${this.baseUrl}/ModHierarchy/${updateData.id}`, updateData);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error updating hierarchy:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  async deleteHierarchy(id: UUID): Promise<void> {
    try {
      const response = await api.delete(`${this.baseUrl}/DelHierarchy/${id}`);
      console.info('Hierarchy deleted successfully:', response.data.message);
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error deleting hierarchy:', errorMessage);
      throw new Error(errorMessage);
    }
  }
}

export const hierarchyService = new HierarchyService();