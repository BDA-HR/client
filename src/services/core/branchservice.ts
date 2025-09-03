import { api } from '../api';
import type { Branch, BranchType, BranchStat } from '../../types/core/branch';

class BranchService {
  private baseUrl = `${import.meta.env.VITE_CORE_URL || 'api'}/branch`;

  async getBranchById(id: string): Promise<Branch> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching branch:', error);
      throw error;
    }
  }

  async getCompanyBranches(companyId: string): Promise<Branch[]> {
    try {
      const response = await api.get(`${this.baseUrl}/company/${companyId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching company branches:', error);
      throw error;
    }
  }

  async getAllBranches(): Promise<Branch[]> {
    try {
      const response = await api.get(`${this.baseUrl}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all branches:', error);
      throw error;
    }
  }

  async createBranch(companyId: string, branch: Omit<Branch, 'id'>): Promise<Branch> {
    try {
      const response = await api.post(`${this.baseUrl}`, {
        ...branch,
        compId: companyId
      });
      return response.data;
    } catch (error) {
      console.error('Error creating branch:', error);
      throw error;
    }
  }

  async updateBranch(companyId: string, branchId: string, branch: Partial<Branch>): Promise<Branch> {
    try {
      const response = await api.put(`${this.baseUrl}/${branchId}`, {
        ...branch,
        compId: companyId
      });
      return response.data;
    } catch (error) {
      console.error('Error updating branch:', error);
      throw error;
    }
  }

  async deleteBranch(companyId: string, branchId: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${branchId}?companyId=${companyId}`);
    } catch (error) {
      console.error('Error deleting branch:', error);
      throw error;
    }
  }
}

export const branchService = new BranchService();