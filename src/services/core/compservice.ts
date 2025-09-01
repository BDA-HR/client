import { api } from '../api';
import type { Company, UUID } from '../../types/core/comp';
import type { Branch } from '../../types/core/branch';

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

  async createCompany(company: Omit<Company, 'id' | 'branches'>): Promise<Company> {
    try {
      const response = await api.post(this.baseUrl, company);
      return response.data;
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
    }
  }

  async updateCompany(id: UUID, company: Partial<Company>): Promise<Company> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, company);
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

  async getCompanyBranches(companyId: UUID): Promise<Branch[]> {
    try {
      const response = await api.get(`${this.baseUrl}/${companyId}/branches`);
      return response.data;
    } catch (error) {
      console.error('Error fetching company branches:', error);
      throw error;
    }
  }

  async createBranch(companyId: UUID, branch: Omit<Branch, 'id'>): Promise<Branch> {
    try {
      const response = await api.post(`${this.baseUrl}/${companyId}/branches`, branch);
      return response.data;
    } catch (error) {
      console.error('Error creating branch:', error);
      throw error;
    }
  }

  async updateBranch(companyId: UUID, branchId: UUID, branch: Partial<Branch>): Promise<Branch> {
    try {
      const response = await api.put(`${this.baseUrl}/${companyId}/branches/${branchId}`, branch);
      return response.data;
    } catch (error) {
      console.error('Error updating branch:', error);
      throw error;
    }
  }

  async deleteBranch(companyId: UUID, branchId: UUID): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${companyId}/branches/${branchId}`);
    } catch (error) {
      console.error('Error deleting branch:', error);
      throw error;
    }
  }
}

export const companyService = new CompanyService();