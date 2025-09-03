
import { api } from '../api';
import type { Company, CreateCompanyDto, UpdateCompanyDto, UUID   } from '../../types/core/comp';

class CompanyService {
  private baseUrl = `${import.meta.env.VITE_CORE_URL || 'core/v1'}/company`;

  async getAllCompanies(): Promise<Company[]> {
    try {
      const response = await api.get(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  }

  async getCompanyById(id: UUID): Promise<Company> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching company:', error);
      throw error;
    }
  }

  async createCompany(company: CreateCompanyDto): Promise<Company> {
    try {
      const response = await api.post(this.baseUrl, company);
      return response.data;
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
    }
  }

  async updateCompany(updateData: UpdateCompanyDto): Promise<Company> {
    try {
      const response = await api.put(
        `${this.baseUrl}/${updateData.id}`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating company:', error);
      throw error;
    }
  }

  async deleteCompany(id: UUID): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting company:', error);
      throw error;
    }
  }
}



export const companyService = new CompanyService();