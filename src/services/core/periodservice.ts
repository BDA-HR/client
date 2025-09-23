import { api } from '../api';
import type { PeriodListDto, AddPeriodDto, EditPeriodDto, UUID } from '../../types/core/period';

class PeriodService {
  private baseUrl = `${import.meta.env.VITE_CORE_MODULE_URL || 'core/module/v1'}/period`;

  async getAllPeriods(): Promise<PeriodListDto[]> {
    try {
      const response = await api.get(`${this.baseUrl}/AllPeriod`);
      return response.data;
    } catch (error) {
      console.error('Error fetching periods:', error);
      throw error;
    }
  }

  async getPeriodById(id: UUID): Promise<PeriodListDto> {
    try {
      const response = await api.get(`${this.baseUrl}/GetPeriod/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching period:', error);
      throw error;
    }
  }

  async createPeriod(period: AddPeriodDto): Promise<PeriodListDto> {
    try {
      const response = await api.post(`${this.baseUrl}/AddPeriod`, period);
      return response.data;
    } catch (error) {
      console.error('Error creating period:', error);
      throw error;
    }
  }

  async updatePeriod(updateData: EditPeriodDto): Promise<PeriodListDto> {
    try {
      const response = await api.put(`${this.baseUrl}/ModPeriod/${updateData.id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating period:', error);
      throw error;
    }
  }

  async deletePeriod(id: UUID): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/DelPeriod/${id}`);
    } catch (error) {
      console.error('Error deleting period:', error);
      throw error;
    }
  }
}

export const periodService = new PeriodService();