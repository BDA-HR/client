import { api } from '../api';
import type { FiscYearListDto, AddFiscYearDto, EditFiscYearDto, UUID } from '../../types/core/fisc';

class FiscalYearService {
  private baseUrl = `${import.meta.env.VITE_CORE_MODULE_URL || 'core/module/v1'}/FiscalYear`;

  async getAllFiscalYears(): Promise<FiscYearListDto[]> {
    try {
      const response = await api.get(`${this.baseUrl}/AllFiscalYear`);
      return response.data;
    } catch (error) {
      console.error('Error fetching fiscal years:', error);
      throw error;
    }
  }

  async getFiscalYearById(id: UUID): Promise<FiscYearListDto> {
    try {
      const response = await api.get(`${this.baseUrl}/GetFiscalYear/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching fiscal year:', error);
      throw error;
    }
  }

  async createFiscalYear(fiscalYear: AddFiscYearDto): Promise<FiscYearListDto> {
    try {
      const response = await api.post(`${this.baseUrl}/AddFiscalYear`, fiscalYear);
      return response.data;
    } catch (error) {
      console.error('Error creating fiscal year:', error);
      throw error;
    }
  }

  async updateFiscalYear(updateData: EditFiscYearDto): Promise<FiscYearListDto> {
    try {
      const response = await api.put(`${this.baseUrl}/ModFiscalYear/${updateData.id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating fiscal year:', error);
      throw error;
    }
  }

  async deleteFiscalYear(id: UUID): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/DelFiscalYear/${id}`);
    } catch (error) {
      console.error('Error deleting fiscal year:', error);
      throw error;
    }
  }
}

export const fiscalYearService = new FiscalYearService();