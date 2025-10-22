
import { api } from '../api';
import type { CompListDto, AddCompDto, EditCompDto} from '../../types/core/comp';
import type { UUID } from 'crypto';

class CompanyService {
  private baseUrl = `${import.meta.env.VITE_CORE_MODULE_URL || 'core/module/v1'}/Company`;

  async getAllCompanies(): Promise<CompListDto[]> {
    try {
      const response = await api.get(`${this.baseUrl}/AllCompany`);
      return response.data;
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  }

  async getCompanyById(id: UUID): Promise<CompListDto> {
    try {
      const response = await api.get(`${this.baseUrl}/GetCompany/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching company:', error);
      throw error;
    }
  }

  async createCompany(company: AddCompDto): Promise<CompListDto> {
    try {
      const response = await api.post(`${this.baseUrl}/AddCompany`, company);
      console.info('Error creating company:', response.data.id);
      return response.data;
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
    }
  }

  async updateCompany(updateData: EditCompDto): Promise<CompListDto> {
    try {
      const response = await api.put(`${this.baseUrl}/ModCompany/${updateData.id}`,updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating company:', error);
      throw error;
    }
  }

  async deleteCompany(id: UUID): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/DelCompany/${id}`);
    } catch (error) {
      console.error('Error deleting company:', error);
      throw error;
    }
  }
}



export const companyService = new CompanyService();