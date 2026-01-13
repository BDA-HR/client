import { api } from '../../api';
import type { FiscYearListDto, AddFiscYearDto, EditFiscYearDto, UUID } from '../../../types/core/fisc';

export interface FiscalYearFilters {
  search?: string;
  page?: number;
  limit?: number;
}

class FiscalYearApi {
  private baseUrl = `${import.meta.env.VITE_CORE_MODULE_URL || 'core/module/v1'}/FiscalYear`;

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

  async getAllFiscalYears(): Promise<FiscYearListDto[]> {
    try {
      const response = await api.get(`${this.baseUrl}/AllFiscalYear`);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error fetching fiscal years:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  async getFiscalYearById(id: UUID): Promise<FiscYearListDto> {
    try {
      const response = await api.get(`${this.baseUrl}/GetFiscalYear/${id}`);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error fetching fiscal year:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  async createFiscalYear(fiscalYear: AddFiscYearDto): Promise<FiscYearListDto> {
    try {
      const response = await api.post(`${this.baseUrl}/AddFiscalYear`, fiscalYear);
      console.info('Fiscal year created successfully:', response.data.data.id);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error creating fiscal year:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  async updateFiscalYear(updateData: EditFiscYearDto): Promise<FiscYearListDto> {
    try {
      const response = await api.put(`${this.baseUrl}/ModFiscalYear/${updateData.id}`, updateData);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error updating fiscal year:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  async deleteFiscalYear(id: UUID): Promise<void> {
    try {
      const response = await api.delete(`${this.baseUrl}/DelFiscalYear/${id}`);
      console.info('Fiscal year deleted successfully:', response.data.message);
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error deleting fiscal year:', errorMessage);
      throw new Error(errorMessage);
    }
  }
}

// Export a singleton instance
export const fiscalYearApi = new FiscalYearApi();

// Also export functions for React Query integration
export const fiscalYearFetcher = {
  // Queries
  getAllFiscalYears: () => fiscalYearApi.getAllFiscalYears(),
  getFiscalYearById: (id: UUID) => fiscalYearApi.getFiscalYearById(id),

  // Mutations
  createFiscalYear: (data: AddFiscYearDto) => fiscalYearApi.createFiscalYear(data),
  updateFiscalYear: (data: EditFiscYearDto) => fiscalYearApi.updateFiscalYear(data),
  deleteFiscalYear: (id: UUID) => fiscalYearApi.deleteFiscalYear(id),
};

// For easy service replacement, export an interface
export interface IFiscalYearApi {
  getAllFiscalYears(): Promise<FiscYearListDto[]>;
  getFiscalYearById(id: UUID): Promise<FiscYearListDto>;
  createFiscalYear(fiscalYear: AddFiscYearDto): Promise<FiscYearListDto>;
  updateFiscalYear(updateData: EditFiscYearDto): Promise<FiscYearListDto>;
  deleteFiscalYear(id: UUID): Promise<void>;
}