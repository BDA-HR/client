import { api } from '../api';
import type { PeriodListDto, AddPeriodDto, EditPeriodDto, UUID } from '../../types/core/period';

class PeriodService {
  private baseUrl = `${import.meta.env.VITE_CORE_MODULE_URL || 'core/module/v1'}/Period`;

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

  async getAllPeriods(): Promise<PeriodListDto[]> {
    try {
      const response = await api.get(`${this.baseUrl}/AllPeriod`);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error fetching periods:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  async getPeriodById(id: UUID): Promise<PeriodListDto> {
    try {
      const response = await api.get(`${this.baseUrl}/GetPeriod/${id}`);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error fetching period:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  async createPeriod(period: AddPeriodDto): Promise<PeriodListDto> {
    try {
      const response = await api.post(`${this.baseUrl}/AddPeriod`, period);
      console.info('Period created successfully:', response.data.data.id);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error creating period:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  async updatePeriod(updateData: EditPeriodDto): Promise<PeriodListDto> {
    try {
      const response = await api.put(`${this.baseUrl}/ModPeriod/${updateData.id}`, updateData);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error updating period:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  async deletePeriod(id: UUID): Promise<void> {
    try {
      const response = await api.delete(`${this.baseUrl}/DelPeriod/${id}`);
      console.info('Period deleted successfully:', response.data.message);
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error deleting period:', errorMessage);
      throw new Error(errorMessage);
    }
  }
}

export const periodService = new PeriodService();