import { api } from '../api';

export interface Company {
  id: string;
  name: string;
  nameAm: string;
  branches: Branch[];
}

export interface Branch {
  id: string;
  branchId: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  city: string;
  country: string;
  // ... other branch properties
}

class CompanyService {
  private baseUrl = `${import.meta.env.VITE_CORE_URL || 'http://localhost:1212/api/core/v1'}/companies`;

  async getAllCompanies(): Promise<Company[]> {
    try {
      const response = await api.get(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  }

  async getCompanyById(id: string): Promise<Company> {
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

  async updateCompany(id: string, company: Partial<Company>): Promise<Company> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, company);
      return response.data;
    } catch (error) {
      console.error('Error updating company:', error);
      throw error;
    }
  }

  async deleteCompany(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting company:', error);
      throw error;
    }
  }

  async getCompanyBranches(companyId: string): Promise<Branch[]> {
    try {
      const response = await api.get(`${this.baseUrl}/${companyId}/branches`);
      return response.data;
    } catch (error) {
      console.error('Error fetching company branches:', error);
      throw error;
    }
  }

  async createBranch(companyId: string, branch: Omit<Branch, 'id'>): Promise<Branch> {
    try {
      const response = await api.post(`${this.baseUrl}/${companyId}/branches`, branch);
      return response.data;
    } catch (error) {
      console.error('Error creating branch:', error);
      throw error;
    }
  }

  async updateBranch(companyId: string, branchId: string, branch: Partial<Branch>): Promise<Branch> {
    try {
      const response = await api.put(`${this.baseUrl}/${companyId}/branches/${branchId}`, branch);
      return response.data;
    } catch (error) {
      console.error('Error updating branch:', error);
      throw error;
    }
  }

  async deleteBranch(companyId: string, branchId: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${companyId}/branches/${branchId}`);
    } catch (error) {
      console.error('Error deleting branch:', error);
      throw error;
    }
  }
}

export const companyService = new CompanyService();